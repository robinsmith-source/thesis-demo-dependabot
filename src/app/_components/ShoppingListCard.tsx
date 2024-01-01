"use client";

import type { ShoppingList, ShoppingListItem } from "@prisma/client";
import ShoppingListHandler, {
  Modes,
} from "~/app/_components/ShoppingListFormHandler";
import IngredientTable from "~/app/_components/IngredientTable";
import { Card, CardHeader } from "@nextui-org/card";

export interface ShoppingListTableProps {
  shoppingList: ShoppingList & {
    items: ShoppingListItem[];
  };
}

export default function ShoppingListCard({
  shoppingList,
}: ShoppingListTableProps) {
  return (
    <Card className="w-full sm:w-[17rem]">
      <CardHeader className="flex flex-col items-start justify-center space-y-2">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-xl font-semibold">{shoppingList.name}</h2>
          <div className="space-x-2">
            <ShoppingListHandler
              mode={Modes.EDIT}
              buttonSize="sm"
              shoppingList={shoppingList}
            />
            <ShoppingListHandler
              mode={Modes.DELETE}
              buttonSize="sm"
              shoppingList={shoppingList}
            />
          </div>
        </div>
        <p className="text-left text-sm">{shoppingList.description}</p>
      </CardHeader>

      {shoppingList.items.length > 0 && (
        <IngredientTable
          className="mt-4"
          ingredients={shoppingList.items}
          isSelectable={true}
          onSelect={() => {}}
        />
      )}
    </Card>
  );
}
