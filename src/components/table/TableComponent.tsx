"use client";

import {
  Table,
  ActionIcon,
  Group,
  Pagination,
  Text,
  Flex,
  Select,
  Modal,
  Button,
  Loader,
} from "@mantine/core";
import { IconEdit, IconTrash, IconLogout } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import { toast } from "react-toastify";
import EditInventoryForm from "../EditInventory";
import InventoryReleaseForm from "../ReleaseForm";

interface InventoryItem {
  id: string;
  inventory_name: string;
  category: string;
  entry_date: string;
  expiring_date: string | null;
  quantity: number;
}

interface CategoryOption {
  value: string;
  label: string;
}

const categoryOptions: CategoryOption[] = [
  { value: "furniture", label: "Furniture" },
  { value: "electronics", label: "Electronics" },
  { value: "stationery", label: "Stationery" },
  { value: "office_supplies", label: "Office Supplies" },
  { value: "appliances", label: "Appliances" },
  { value: "others", label: "Others" },
];

interface Props {
  selectedCategory?: CategoryOption | null;
  searchQuery: string;
}

export default function InventoryTable({
  selectedCategory,
  searchQuery,
}: Props) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<string | null>("5");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [openedEdit, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    filterInventory();
  }, [inventory, selectedCategory, searchQuery]);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/inventory/getall/"
      );
      setInventory(response.data);
      setError(false);
    } catch (err) {
      setError(true);
      console.error("Error fetching inventory:", err);
      toast.error("Failed to load inventory data");
    } finally {
      setIsLoading(false);
    }
  };

  const filterInventory = () => {
    let filtered = [...inventory];

    // Apply category filter if selected
    if (selectedCategory) {
      filtered = filtered.filter(
        (item) => item.category === selectedCategory.value
      );
    }

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.inventory_name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.entry_date.toLowerCase().includes(query) ||
          (item.expiring_date &&
            item.expiring_date.toLowerCase().includes(query))
      );
    }

    setFilteredInventory(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const getCategoryLabel = (value: string) => {
    return categoryOptions.find((opt) => opt.value === value)?.label || value;
  };

  const handleEdit = (item: InventoryItem) => {
    setModalType("edit");
    setSelectedItem(item);
    openEdit();
  };

  const handleDelete = (item: InventoryItem) => {
    setSelectedItem(item);
    openDelete();
  };

  const confirmDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(
        `http://127.0.0.1:8000/api/inventory/${selectedItem?.id}/delete/`
      );

      setInventory(inventory.filter((item) => item.id !== selectedItem?.id));
      toast.success("Item deleted successfully");
      closeDelete();
    } catch (err) {
      console.error("Error deleting item:", err);
      toast.error("Failed to delete item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination logic
  const itemsPerPageNum = parseInt(itemsPerPage || "5");
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPageNum);
  const paginatedData = filteredInventory.slice(
    (currentPage - 1) * itemsPerPageNum,
    currentPage * itemsPerPageNum
  );

  if (isLoading)
    return (
      <div className="flex justify-center p-8">
        <Loader />
      </div>
    );
  if (error)
    return (
      <Text color="red" className="p-4">
        Error loading inventory data
      </Text>
    );

  return (
    <div>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Quantity</Table.Th>
            <Table.Th>Entry Date</Table.Th>
            <Table.Th>Expiry Date</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item) => (
              <Table.Tr key={item.id}>
                <Table.Td>{item.inventory_name}</Table.Td>
                <Table.Td>{getCategoryLabel(item.category)}</Table.Td>
                <Table.Td>{item.quantity}</Table.Td>
                <Table.Td>{item.entry_date?.split("T")[0]}</Table.Td>
                <Table.Td>
                  {item.expiring_date?.split("T")[0] || "N/A"}
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon
                      variant="subtle"
                      onClick={() => {
                        setModalType("release");
                        setSelectedItem(item);
                        openEdit();
                      }}>
                      <IconLogout size={16} color="green" />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      onClick={() => handleEdit(item)}>
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => handleDelete(item)}>
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))
          ) : (
            <Table.Tr>
              <Table.Td colSpan={6} className="text-center py-4">
                No inventory items found
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>

      {filteredInventory.length > 0 && (
        <Flex justify="space-between" mt="md">
          <Select
            value={itemsPerPage}
            onChange={setItemsPerPage}
            data={["5", "10", "20"]}
            style={{ width: 100 }}
          />
          <Pagination
            value={currentPage}
            onChange={setCurrentPage}
            total={totalPages}
          />
        </Flex>
      )}

      {/* Edit Modal */}
      <Modal
        opened={openedEdit}
        onClose={closeEdit}
        title={modalType === "edit" ? "Edit Item" : "Release Inventory"}>
        {modalType === "edit" ? (
          <EditInventoryForm id={selectedItem?.id || ""} />
        ) : (
          <InventoryReleaseForm
            close={closeEdit}
            inventoryItem={
              selectedItem
                ? {
                    id: selectedItem.id,
                    name: selectedItem.inventory_name,
                    currentQuantity: selectedItem.quantity,
                  }
                : {
                    id: "",
                    name: "",
                    currentQuantity: 0,
                  }
            }
          />
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal opened={openedDelete} onClose={closeDelete} title="Confirm Delete">
        <Text>
          Are you sure you want to delete {selectedItem?.inventory_name}?
        </Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={closeDelete}>
            Cancel
          </Button>
          <Button color="red" onClick={confirmDelete} loading={isLoading}>
            Delete
          </Button>
        </Group>
      </Modal>
    </div>
  );
}
