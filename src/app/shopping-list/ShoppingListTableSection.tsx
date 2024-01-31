import ShoppingListCard from "~/app/shopping-list/ShoppingListCard";
import { type ShoppingListTableProps } from "~/app/lib/types";
export default function ShoppingListTableSection({
  className,
  shoppingLists,
}: {
  className?: string;
  shoppingLists: ShoppingListTableProps["shoppingList"][];
}) {
  console.log(shoppingLists);
  return (
    <section
      className={`${className} grid grid-cols-1 items-start justify-center gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}
    >
      {shoppingLists.map((shoppingList) => (
        <ShoppingListCard shoppingList={shoppingList} key={shoppingList.id} />
      ))}
    </section>
  );
}
