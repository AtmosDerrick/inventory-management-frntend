"use client";

import React, { useState } from "react";
import { IconArrowRight, IconPlus, IconSearch } from "@tabler/icons-react";
import {
  ActionIcon,
  TextInput,
  useMantineTheme,
  rem,
  Box,
  Button,
  Group,
  Modal,
  Select,
} from "@mantine/core";
import TableComponent from "@/components/table/TableComponent";
import { useDisclosure } from "@mantine/hooks";
import InventoryForm from "@/components/AddIventoryForm";

interface SearchInputProps extends React.ComponentPropsWithoutRef<"div"> {
  onSearch?: (query: string) => void;
}

const SearchPage: React.FC<SearchInputProps> = ({ onSearch, ...props }) => {
  const theme = useMantineTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const [cateogry, setCategory] = useState<any>("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
      <Box {...props}>
        <div className="w-3/4 mx-auto mt-6 flex justify-between">
          <div className="w-2/6">
            <TextInput
              radius="xl"
              size="md"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              onKeyDown={handleKeyDown}
              rightSectionWidth={42}
              leftSection={
                <IconSearch style={{ width: rem(18), height: rem(18) }} />
              }
              rightSection={
                <ActionIcon
                  size={32}
                  radius="xl"
                  color={theme.primaryColor}
                  variant="filled"
                  onClick={handleSearch}
                  aria-label="Search">
                  <IconArrowRight
                    style={{ width: rem(18), height: rem(18) }}
                    stroke={1.5}
                  />
                </ActionIcon>
              }
              style={{ flex: 1 }}
            />
          </div>

          <div className="flex justify-between gap-x-4 items-center">
            <Select
              placeholder="Select Category"
              value={cateogry ? cateogry.value : null}
              onChange={(_value, option) => setCategory(option)}
              data={[
                { value: "furniture", label: "Furniture" },
                { value: "books", label: "Book & Education Material" },
                { value: "technology", label: "Technology" },
                { value: "science", label: "Science & Lab Equipment" },
                { value: "sports", label: "Sports & PE Equipment" },
                { value: "art", label: "Art & Music" },
                { value: "stationery", label: "Stationery" },
                { value: "transport", label: "Transport" },
                { value: "others", label: "Others" },
              ]}
            />

            <Button
              leftSection={<IconPlus size={24} />}
              variant="outline"
              radius="xl"
              onClick={open}>
              Create Inventory
            </Button>
          </div>
        </div>

        <div className="w-3/4 mx-auto mt-8">
          <TableComponent selectedCategory={cateogry} />
        </div>
      </Box>
      <Modal opened={opened} onClose={close} title="Add Inventory" centered>
        <div>
          <InventoryForm close={close} />
        </div>
      </Modal>
    </div>
  );
};

export default SearchPage;
