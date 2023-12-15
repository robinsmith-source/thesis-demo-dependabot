"use client";

import { useState } from "react";
import { Input } from "@nextui-org/react";
import { SearchIcon } from "@nextui-org/shared-icons";

export default function RecipeSearchBar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <Input
      fullWidth
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleSearch();
      }}
      placeholder="Search recipes..."
      endContent={<SearchIcon name="search" onClick={handleSearch} />}
    />
  );
}
