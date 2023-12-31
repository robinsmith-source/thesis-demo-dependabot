"use client";

import { Autocomplete, AutocompleteItem, Button } from "@nextui-org/react";
import type { ShoppingList } from "@prisma/client";
import { type Key, useState } from "react";
import { FaPlus } from "react-icons/fa6";

export default function ShoppingListSelector({
  shoppingLists,
  onChange,
}: {
  shoppingLists: ShoppingList[];
  onChange: (value: string) => void;
}) {
  const [value, setValue] = useState<Key>();

  return (
    <div className="flex max-w-xs items-center gap-4">
      <Autocomplete
        defaultItems={shoppingLists}
        label="Shopping List"
        variant="bordered"
        placeholder="Choose a shopping list"
        className="max-w-xs"
        size="sm"
        selectedKey={value as string}
        onSelectionChange={(value) => {
          setValue(value);
          onChange(value as string);
        }}
      >
        {(item) => (
          <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
        )}
      </Autocomplete>
      <Button isIconOnly color="success">
        <FaPlus />
      </Button>
    </div>
  );
}
