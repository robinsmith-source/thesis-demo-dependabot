"use client";

import { Input } from "@nextui-org/react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function AdvancedRecipeSearch(className?: string) { 
  const pathname = usePathname();
  const router = useRouter();
  if (!className) className = "w-full";

  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((searchFilters: string) => {
    const params = new URLSearchParams(searchParams);

    searchFilters ? params.set("name", searchFilters) : params.delete("name");
    params.set("name", searchFilters);

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
