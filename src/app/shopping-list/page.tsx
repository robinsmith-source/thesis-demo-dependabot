import { api } from "~/trpc/server";
import ShoppingListFormHandler from "~/app/shopping-list/ShoppingListFormHandler";
import ShoppingListTableSection from "~/app/shopping-list/ShoppingListTableSection";
import { ShoppingListModes } from "~/app/lib/types";

export const dynamic = "force-dynamic";
export default async function Page() {
  const shoppingLists = await api.shoppingList.getAllTables.query();
  return (
    <main className="flex flex-col items-center justify-center space-y-8">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Shopping Lists</h1>
        <ShoppingListFormHandler mode={ShoppingListModes.CREATE} />
      </div>
      <ShoppingListTableSection shoppingLists={shoppingLists} />
    </main>
  );
}
