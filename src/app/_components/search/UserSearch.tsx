"use client";

import { Card, Input } from "@nextui-org/react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import SearchViewOptions from "./SearchViewOptions";

export default function UserSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

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
        <div className="m-2 flex flex-row items-center gap-2">
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
      </Card>
    </div>
  );
}
