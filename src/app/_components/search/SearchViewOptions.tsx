"use client";

import {
  DropdownMenu,
  DropdownItem,
  Select,
  SelectItem,
  Button,
  Dropdown,
  DropdownTrigger,
} from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { FaArrowDownWideShort, FaListOl } from "react-icons/fa6";

export default function SearchViewOptions() {
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

  const sortOptions = [
    { label: "Newest", value: "NEWEST" },
    { label: "Oldest", value: "OLDEST" },
    { label: "Rating", value: "RATING" },
  ];
  const [selectedSorting, setSelectedSorting] = useState([
    searchParams.get("order") ?? "NEWEST",
  ]);

  const pageSizes = ["4", "6", "12"];
  const [selectedPageSize, setSelectedPageSize] = useState([
    searchParams.get("pageSize") ?? "12",
  ]);

  const handleSearch = ({
    sort,
    size,
  }: { sort?: string; size?: string } = {}) => {
    const params = new URLSearchParams(searchParams);

    // reset page
    if (params.get("page") !== "1") {
      params.set("page", "1");
    }

    sort ? params.set("order", sort) : params.delete("order");
    if (size) {
      params.set("pageSize", size);
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      {isSmallScreen ? (
        <div className="flex-row items-center justify-between space-x-1">
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="flat" size="lg">
                <FaArrowDownWideShort />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              selectionMode="single"
              defaultSelectedKeys={selectedSorting}
              onSelectionChange={(value) => {
                setSelectedSorting([Array.from(value)[0]?.toString() ?? ""]);
                handleSearch({
                  sort: Array.from(value)[0]?.toString() ?? "",
                });
              }}
            >
              {sortOptions.map((option) => (
                <DropdownItem
                  key={option.value}
                  onClick={() => handleSearch({ sort: option.value })}
                >
                  {option.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="flat" size="lg">
                <FaListOl />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              selectionMode="single"
              defaultSelectedKeys={selectedPageSize}
              onSelectionChange={(value) => {
                setSelectedPageSize([Array.from(value)[0]?.toString() ?? ""]);
                handleSearch({
                  size: Array.from(value)[0]?.toString() ?? "",
                });
              }}
            >
              {pageSizes.map((size) => (
                <DropdownItem
                  key={size}
                  onClick={() => handleSearch({ size: size })}
                >
                  {size}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      ) : (
        <div className="flex-row items-center justify-around space-x-1">
          <Select
            fullWidth={false}
            size="sm"
            className="w-28"
            selectionMode="single"
            label="Sort by"
            disallowEmptySelection
            defaultSelectedKeys={selectedSorting}
            onSelectionChange={(value) => {
              handleSearch({
                sort: Array.from(value)[0]?.toString() ?? "",
              });
              setSelectedSorting([Array.from(value)[0]?.toString() ?? ""]);
            }}
          >
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
          <Select
            fullWidth={false}
            size="sm"
            className="w-28"
            selectionMode="single"
            label="pagesize"
            disallowEmptySelection
            defaultSelectedKeys={selectedPageSize}
            selectedKeys={selectedPageSize}
            onSelectionChange={(value) => {
              handleSearch({
                size: Array.from(value)[0]?.toString() ?? "",
              });
              setSelectedPageSize([Array.from(value)[0]?.toString() ?? ""]);
            }}
          >
            {pageSizes.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </Select>
        </div>
      )}
    </div>
  );
}
