"use client";

import { type ChangeEvent, useState } from "react";
import { Input, Tab, Tabs } from "@nextui-org/react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

type queryInput =
  | Partial<{
      name?: string;
      difficulty?: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
      labels?: Label[];
      tags?: string[];
      authorId?: string;
    }>
  | undefined;

type Label = {
  name: string;
  category: {
    name: string;
  };
};

export default function AdvancedRecipeSearch() {
  const pathname = usePathname();
  const router = useRouter();

  // search parameters
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<queryInput>();
  const [selectedSearchMode, setSelectedSearchMode] = useState("public");

  const handleSearch = useDebouncedCallback(
    (searchFilters: queryInput) => {
      const params = new URLSearchParams(searchParams);

      if (searchFilters) {
        const { name, difficulty, labels, tags, authorId } = searchFilters;

        name != null && params.set("name", name); // "" === null | without this empty search bar does not work
        difficulty && params.set("difficulty", difficulty ?? "");
        tags && params.set("tags", tags?.join() ?? "");
        authorId && params.set("authorId", authorId ?? "");
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    333, // debounce time in ms
  );

  return (
    <>
      <div className="flex w-full flex-row justify-end">
        <Input
          fullWidth
          type="text"
          defaultValue={searchParams.get("name")?.toString()}
          placeholder="Search recipes..."
          onValueChange={(event: string) => {
            const name = event;
            setSearchQuery((prevQuery) => ({ ...prevQuery, name }));
            handleSearch({ ...searchQuery, name });
            console.log(event);
          }}
          endContent={<FaMagnifyingGlass />}
        />
      </div>
    </>
  );
}
