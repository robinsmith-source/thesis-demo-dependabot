"use client";

import { FaTag } from "react-icons/fa6";
import { Chip, Select, SelectItem, SelectSection } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Label = {
  name: string;
  category: {
    name: string;
  };
};

export default function LabelSelect(
  { labels }: { labels?: Label[] },
  className?: string,
) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [labelInput, setLabelInput] = useState<string[]>([]);
  if (!className) className = "";
  const placeholder = "Select labels";

  // Extract unique categories from labels
  const uniqueCategories = Array.from(
    new Set(labels?.map((label) => label.category.name)),
  );

  function handleLabelFilter(selectedLabels: string[]) {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    
    selectedLabels ? params.set("labels", selectedLabels.join()): params.delete("labels");
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Select
      aria-label="Labels"
      placeholder={placeholder}
      selectionMode="multiple"
      startContent={<FaTag />}
      className={className}
      size="sm"
      selectedKeys={labelInput}
      onSelectionChange={(selection) => {
        const newLabelInput = Array.from(selection).map(String);
        setLabelInput(newLabelInput);
        handleLabelFilter(newLabelInput);
      }}
      renderValue={() => {
        //default when empty
        if (labelInput.length === 0) {
          return placeholder;
        }

        return labelInput.map((label) => (
          <Chip
            key={label}
            onClose={() => {
              const newLabelInput = labelInput.filter(
                (input) => input !== label,
              );
              setLabelInput(newLabelInput);
              handleLabelFilter(newLabelInput);
            }}
          >
            {label}
          </Chip>
        ));
      }}
    >
      {uniqueCategories.map((category) => (
        <SelectSection key={category} title={category}>
          {labels ? (
            labels
              .filter((label) => label.category.name === category)
              .map((label) => (
                <SelectItem key={label.name} value={label.name}>
                  {label.name}
                </SelectItem>
              ))
          ) : (
            <SelectItem key="error">None</SelectItem>
          )}
        </SelectSection>
      ))}
    </Select>
  );
}
