"use client";

import { useState, type KeyboardEvent } from "react";
import {
  Accordion,
  AccordionItem,
  Autocomplete,
  AutocompleteItem,
  Tab,
  Tabs,
  Button,
  Input,
  Link,
} from "@nextui-org/react";
import { FaMagnifyingGlass, FaFilter } from "react-icons/fa6";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import NextLink from "next/link";

type queryInput =
  | Partial<{
      name?: string;
      difficulty?: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
      labels?: string[];
      tags?: string[];
      authorId?: string;
    }>
  | undefined;

export default function RecipeSearchbar({ labels }: { labels?: string[] }) {
  const pathname = usePathname();
  const router = useRouter();

  // search parameters
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<queryInput>();
  const [selectedSearchMode, setSelectedSearchMode] = useState("public");

  type HandleSearchFunction = (searchFilters: queryInput) => void;
  const handleSearch: HandleSearchFunction = useDebouncedCallback(
    // debounce the search function to save resources
    (searchFilters: queryInput) => {
      const params = new URLSearchParams(searchParams);
      console.log(searchFilters);

      if (searchFilters) {
        const { name, difficulty, labels, tags, authorId } = searchFilters;

        name && params.set("name", name ?? "");
        difficulty && params.set("difficulty", difficulty ?? "");
        if (labels) {
          // reset the labels array in the URL
          params.delete("labels[]");
          labels.forEach((label) => {
            params.append(`labels[]`, label);
          });
        }
        tags && params.set("tags", tags?.join(",") ?? "");
        authorId && params.set("authorId", authorId ?? "");
      }

      if (pathname !== `/recipe/search`) {
        router.push(`/recipe/search?${params.toString()}`);
      } else {
        router.replace(`${pathname}?${params.toString()}`);
      }
    },
    300, // debounce time in ms
  );

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleSearch(searchQuery);
    }
  }

  return (
    <>
      <div className="flex w-full flex-row-reverse justify-end align-middle">
        <Input
          fullWidth
          type="text"
          // isClearable
          value={searchQuery?.name ?? ""}
          onChange={(event) =>
            setSearchQuery({ ...searchQuery, name: event.target.value })
          }
          onKeyDown={handleKeyDown}
          defaultValue={searchParams.get("name")?.toString()} // ensure that the input field is in sync with the URL
          placeholder="Search recipes..."
          description={
            pathname !== "/recipe/search" ? (
              <Link
                as={NextLink}
                href="/recipe/search"
                className="text-secondary-200"
                size="sm"
              >
                <a>Advanced</a>
              </Link>
            ) : null
          }
          endContent={
            <Button
              onClick={() => handleSearch(searchQuery)}
              endContent={<FaMagnifyingGlass size={30} />}
            >
              <p className="hidden sm:text-default-600">Search</p>
            </Button>
          }
        />
      </div>
      {pathname === "/recipe/search" && (
        <Tabs
          className="mr-4"
          size="lg"
          aria-label="searchmode"
          selectedKey={selectedSearchMode}
          onSelectionChange={(selectedTab) => {
            if (selectedTab) {
              setSelectedSearchMode(selectedTab.toString());
            }
          }}
        >
          <Tab key="public" title="public" />
          <Tab key="advanced" title="private" />
        </Tabs>
      )}
      {pathname === "/recipe/search" && (
        <Accordion className="mt-0" isCompact>
          <AccordionItem
            startContent={<FaFilter />}
            title="Advanced"
            key="filters"
            aria-label="filters"
          >
            <div className="flex flex-col justify-start">
              <Autocomplete
                className="mb-4 sm:w-1/3 md:w-1/4 lg:w-1/5"
                label="Labels"
                labelPlacement="outside-left"
                onSelectionChange={(selectedLabel) => {
                  if (selectedLabel) {
                    setSearchQuery((prevQuery) => ({
                      ...prevQuery,
                      labels: [
                        ...(prevQuery?.labels || []),
                        selectedLabel.toString(),
                      ],
                    }));
                  }
                }}
              >
                {
                  // this is to please TypeScript
                  (labels || []).map((label) => (
                    <AutocompleteItem key={label}>{label}</AutocompleteItem>
                  ))
                }
              </Autocomplete>
            </div>
          </AccordionItem>
        </Accordion>
      )}
    </>
  );
}
