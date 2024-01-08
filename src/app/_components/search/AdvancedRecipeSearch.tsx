"use client";

import { Input } from "@nextui-org/react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";


export default function AdvancedRecipeSearch() {
  const pathname = usePathname();
  const router = useRouter();

  // search parameters
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback(
    (searchFilters: string) => {
      const params = new URLSearchParams(searchParams);

      searchFilters ? params.set("name", searchFilters ) : params.delete("name");
        params.set("name", searchFilters); 
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    333, // debounce time in ms
  );

  return (
    <div className="flex w-full flex-row justify-end">
      <Input
        fullWidth
        type="text"
        defaultValue={searchParams.get("name")?.toString()}
        placeholder="Search recipes..."
        onValueChange={handleSearch}
        endContent={<FaMagnifyingGlass />}
      />
    </div>
  );
}
