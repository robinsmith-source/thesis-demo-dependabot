"use client";

import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { type Key, useState } from "react";
import ShoppingListFormHandler from "~/app/shopping-list/ShoppingListFormHandler";
import { ShoppingListModes } from "~/app/lib/types";

export default function ShoppingListSelector({
  shoppingLists,
  onChange,
}: {
  shoppingLists: {
    id: string;
    name: string;
  }[];
  onChange: (value: string) => void;
}) {
  const [value, setValue] = useState<Key>("");

  return (
    <div className="flex w-full items-center justify-between gap-4 sm:max-w-xs">
      <Autocomplete
        defaultItems={shoppingLists}
        label="Shopping List"
        variant="bordered"
        placeholder="Choose a shopping list"
        className="w-full sm:max-w-xs"
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
      <ShoppingListFormHandler mode={ShoppingListModes.CREATE} />
    </div>
  );
}
