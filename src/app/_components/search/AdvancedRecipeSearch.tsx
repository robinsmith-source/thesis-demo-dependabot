"use client";

import { Input } from "@nextui-org/react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

type AdvancedRecipeSearchProps = {
  className?: string;
};

export default function AdvancedRecipeSearch({
  className = "w-full",
}: AdvancedRecipeSearchProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!className) className = "w-full";

  const handleSearch = useDebouncedCallback((searchFilters: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    searchFilters ? params.set("name", searchFilters) : params.delete("name");

    router.replace(`${pathname}?${params.toString()}`);
  }, 333); // debounce in ms

  return (
    <Input
      type="text"
      defaultValue={searchParams.get("name")?.toString()}
      placeholder="Search recipes..."
      onValueChange={handleSearch}
      endContent={<FaMagnifyingGlass />}
      className={className}
    />
  );
}
