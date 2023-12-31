"use client";

import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import type { ShoppingList } from "@prisma/client";
import { Key, useState } from "react";

export default function ShoppingListSelector({
  shoppingLists,
  onChange,
}: {
  shoppingLists: ShoppingList[];
  onChange: (value: string) => void;
}) {
  const [value, setValue] = useState<Key>();

  return (
    <Autocomplete
      defaultItems={shoppingLists}
      label="Favorite Animal"
      variant="bordered"
      placeholder="Search an animal"
      className="max-w-xs"
      size="sm"
      selectedKey={value as string}
      onSelectionChange={(value) => {
        setValue(value);
        onChange(value as string);
      }}
    >
      {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
    </Autocomplete>
  );
}
