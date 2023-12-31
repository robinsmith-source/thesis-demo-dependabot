import { api } from "~/trpc/server";

export const dynamic = "force-dynamic";
export default async function Page() {
  const shoppingLists = await api.shoppingList.getAll.query();
  return (
    <>
      <h1>Shopping Lists</h1>
      {shoppingLists.map((shoppingList) => (
        <div key={shoppingList.id}>
          <h1>{shoppingList.name}</h1>
        </div>
      ))}
    </>
  );
}
