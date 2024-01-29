"use client";

import { Button, Card, Input } from "@nextui-org/react";
import { FaFilter, FaMagnifyingGlass } from "react-icons/fa6";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import DifficultyInput from "./DifficultyInput";
import LabelSelect from "./LabelSelect";
import { useState } from "react";
import { motion } from "framer-motion";
import SearchViewOptions from "./SearchViewOptions";

type AdvancedRecipeSearchProps = {
  categories: { name: string; RecipeLabel: { name: string }[] }[];
};

export default function AdvancedRecipeSearch({
  categories,
}: AdvancedRecipeSearchProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filtersCollapsed, setFiltersCollapsed] = useState(true);

  const handleSearch = useDebouncedCallback((name: string) => {
    const params = new URLSearchParams(searchParams);

    // reset page
    if (params.get("page") !== "1") {
      params.set("page", "1");
    }

    name ? params.set("name", name) : params.delete("name");

    router.replace(`${pathname}?${params.toString()}`);
  }, 333);

  return (
    <div className="mb-5 w-full justify-center">
      <Card>
        <div className="m-2 flex items-center gap-x-2">
          {/* large screen */}
          <Button
            variant="flat"
            color="secondary"
            size="lg"
            startContent={<FaFilter />}
            className="hidden w-48 md:flex"
            onClick={() => setFiltersCollapsed(!filtersCollapsed)}
          >
            <span>Filters</span>
          </Button>
          {/* small screen */}
          <Button
            variant="flat"
            color="secondary"
            size="lg"
            isIconOnly
            className="sm:flex md:hidden"
            onClick={() => setFiltersCollapsed(!filtersCollapsed)}
          >
            <FaFilter />
          </Button>
          <Input
            type="text"
            size="sm"
            defaultValue={searchParams.get("name") ?? ""}
            startContent={<FaMagnifyingGlass className="mr-1" />}
            placeholder="Search recipes"
            onValueChange={(value: string) => handleSearch(value)}
          />
          <SearchViewOptions />
        </div>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: !filtersCollapsed ? 1 : 0,
            height: !filtersCollapsed ? "auto" : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-wrap justify-between gap-y-2 gap-x-4 px-4 py-3 sm:items-center">
            <label className="flex items-center gap-2">
              <span className="font-bold text-default-600">Difficulty</span>
              <DifficultyInput />
            </label>

            <label className="flex grow items-center justify-end gap-2">
              <span className="grow-0 font-bold text-default-600">Labels</span>
              <LabelSelect
                categories={categories}
                disabled={filtersCollapsed}
                className="max-w-96"
              />
            </label>
          </div>
        </motion.div>
      </Card>
    </div>
  );
}
