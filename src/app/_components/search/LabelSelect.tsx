"use client";

import { FaTag } from "react-icons/fa6";
import { Chip, Select, SelectItem, SelectSection } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

type LabelSelectProps = {
  categories: { name: string; RecipeLabel: { name: string; }[]; }[];
  disabled?: boolean;
  className?: string;
};

export default function LabelSelect({
  categories,
  disabled,
  className,
}: LabelSelectProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [labelInput, setLabelInput] = useState<string[]>([]);
  const placeholder = "Select labels";

  const handleLabelFilter = useDebouncedCallback((selectedLabels: string[]) => {
    const params = new URLSearchParams(searchParams);
    // reset page
    if (params.get("page") !== "1") {
      params.set("page", "1");
    }

    selectedLabels && selectedLabels.length > 0
      ? params.set("labels", selectedLabels.join())
      : params.delete("labels");
    router.replace(`${pathname}?${params.toString()}`);
  }, 333);

  return (
    <Select
      isDisabled={disabled}
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
      {categories.map((category) => (
        <SelectSection key={category.name} title={category.name}>
          {category.RecipeLabel.map((label) => (
            <SelectItem key={label.name} value={label.name}>
              {label.name}
            </SelectItem>
          ))}
        </SelectSection>
      )
      )}
    </Select>
  );
}
