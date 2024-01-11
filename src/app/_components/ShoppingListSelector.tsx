"use client";

import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { type Key, useState } from "react";
import ShoppingListFormHandler from "~/app/_components/ShoppingListFormHandler";
import { Modes } from "~/app/lib/shoppingListModes";

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
  const [value, setValue] = useState<Key>();

  return (
    <div className="flex max-w-xs items-center gap-4">
      <Autocomplete
        defaultItems={shoppingLists}
        label="Shopping List"
        variant="bordered"
        placeholder="Choose a shopping list"
        className="max-w-xs"
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
      <ShoppingListFormHandler mode={Modes.CREATE} />
    </div>
  );
}
