"use client";

import {
  Button,
  Card,
  Divider,
  Input,
} from "@nextui-org/react";
import {
  FaFilter,
  FaMagnifyingGlass,
} from "react-icons/fa6";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import DifficultyInput from "./DifficultyInput";
import LabelSelect from "./LabelSelect";
import { useEffect, useState } from "react";
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

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);

  // responsiveness
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsSmallScreen(width < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [filtersCollapsed, setFiltersCollapsed] = useState(true);

  const handleSearch = useDebouncedCallback ((name: string) => {
    const params = new URLSearchParams(searchParams);

    // reset page
    if (params.get("page") !== "1") {
      params.set("page", "1");
    }

    name ? params.set("name", name) : params.delete("name");

    router.replace(`${pathname}?${params.toString()}`);
  }, 333
  );

  return (
    <div className="mb-3 w-full justify-center">
      <Card>
        <div className="m-2 flex flex-row items-center justify-normal space-x-2">
          <Button
            size="lg"
            variant="flat"
            color="secondary"
            startContent={<FaFilter />}
            isIconOnly={isSmallScreen}
            onClick={() => setFiltersCollapsed(!filtersCollapsed)}
          >
            <span className="hidden sm:inline">Filters</span>
          </Button>
          <Input
            type="text"
            defaultValue={searchParams.get("name") ?? ""}
            startContent={<FaMagnifyingGlass className="mr-1" />}
            placeholder="Search recipes"
            onValueChange={(value: string) => handleSearch(value)}
          />
          <SearchViewOptions/>
        </div>
        <motion.div
          className={
            !filtersCollapsed
              ? "mx-4 my-2 flex flex-col items-start justify-between lg:flex-row lg:items-center"
              : ""
          }
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: !filtersCollapsed ? 1 : 0,
            height: !filtersCollapsed ? "auto" : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex w-full flex-col">
            <Divider className="w-full bg-background-400" />
            <div className="mt-2 flex w-full flex-row items-center justify-between">
              <div className="flex flex-row items-center justify-start md:w-1/2">
                <span className="font-bold text-default-600">Difficulty</span>
                <DifficultyInput />
              </div>
              <div className="mr-5 flex flex-row items-center justify-start md:w-1/2">
                <span className="font-bold text-default-600">Labels</span>
                <LabelSelect
                  categories={categories}
                  disabled={filtersCollapsed}
                  className="w-full lg:ml-2 lg:w-2/3"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </Card>
    </div>
  );
}
