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
  TextInput,
  NumberInput,
  Loader,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  IconEaseOut,
  IconEdit,
  IconEye,
  IconFreeRights,
  IconLogout,
  IconOutlet,
  IconRowRemove,
  IconSend,
  IconSignRight,
  IconTrash,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import EditInventoryForm from "../EditInventory";
import { toast } from "react-toastify";
import ReleaseForm from "../ReleaseForm";
import InventoryReleaseForm from "../ReleaseForm";

// Define types
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
  selectedCategory?: any;
}

export default function InventoryTable({ selectedCategory }: Props) {
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

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    quantity: 0,
    entryDate: "",
    expiringDate: "",
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    // Filter inventory when category changes
    if (selectedCategory) {
      console.log(selectedCategory, "qq");
      setFilteredInventory(
        inventory.filter((item) => item.category === selectedCategory.value)
      );
    } else {
      setFilteredInventory(inventory);
    }
    console.log(filteredInventory, "llo");
    setCurrentPage(1); // Reset to first page when filtering
  }, [selectedCategory, inventory]);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      // Replace with your actual API call
      const response = await axios.get(
        "http://127.0.0.1:8000/api/inventory/getall/"
      );
      setInventory(response.data);
      setError(false);
    } catch (err) {
      setError(true);
      console.error("Error fetching inventory:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryLabel = (value: string) => {
    return categoryOptions.find((opt) => opt.value === value)?.label || value;
  };

  const handleEdit = (item: InventoryItem) => {
    setModalType("edit");
    setSelectedItem(item);
    setEditForm({
      name: item.inventory_name,
      category: item.category,
      quantity: item.quantity,
      entryDate: item.entry_date,
      expiringDate: item.expiring_date || "",
    });
    openEdit();
  };

  const handleDelete = (item: InventoryItem) => {
    setSelectedItem(item);
    openDelete();
  };

  const confirmDelete = async () => {
    try {
      setIsLoading(true); // Show loading state

      // Make DELETE request to the API endpoint
      await axios.delete(
        `http://127.0.0.1:8000/api/inventory/${selectedItem?.id}/delete/`
      );

      // Update local state if API call succeeds
      const updatedInventory = inventory.filter(
        (item) => item.id !== selectedItem?.id
      );
      setInventory(updatedInventory);

      // Show success notification
      toast.success("Item deleted successfully");
      closeDelete();
    } catch (err) {
      console.error("Error deleting item:", err);
      // Show error notification
      toast.error("Failed to delete item. Please try again.");
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  // Pagination logic
  const itemsPerPageNum = parseInt(itemsPerPage || "5");
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPageNum);
  const paginatedData = filteredInventory.slice(
    (currentPage - 1) * itemsPerPageNum,
    currentPage * itemsPerPageNum
  );

  if (isLoading) return <Loader />;
  if (error) return <Text color="red">Error loading inventory data</Text>;

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
          {paginatedData.map((item) => (
            <Table.Tr key={item.id}>
              <Table.Td>{item.inventory_name}</Table.Td>
              <Table.Td>{getCategoryLabel(item.category)}</Table.Td>
              <Table.Td>{item.quantity}</Table.Td>
              <Table.Td>{item.entry_date?.split("T")[0]}</Table.Td>
              <Table.Td>{item.expiring_date || "N/A"}</Table.Td>
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
                  <ActionIcon variant="subtle" onClick={() => handleEdit(item)}>
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
          ))}
        </Table.Tbody>
      </Table>

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

      {/* Edit Modal */}
      <Modal
        opened={openedEdit}
        onClose={closeEdit}
        title={modalType === "edit" ? "Edit Item" : "Release Inventory"}>
        {modalType === "edit" ? (
          <EditInventoryForm id={selectedItem ? selectedItem?.id : ""} />
        ) : (
          <div>
            <div className="mt-4">
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
            </div>
          </div>
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
          <Button color="red" onClick={confirmDelete}>
            Delete
          </Button>
        </Group>
      </Modal>
    </div>
  );
}
