import { api } from "~/trpc/server";
import ShoppingListFormHandler from "~/app/_components/ShoppingListFormHandler";
import ShoppingListTableSection from "~/app/_components/ShoppingListTableSection";

export const dynamic = "force-dynamic";
export default async function Page() {
  const shoppingLists = await api.shoppingList.getAllTables.query();
  return (
    <main className="flex flex-col items-center justify-center space-y-8">
      <div className="flex w-full items-center justify-between">
        <h1>Shopping Lists</h1>
        <ShoppingListFormHandler />
      </div>
      <ShoppingListTableSection shoppingLists={shoppingLists} />
    </main>
  );
}
