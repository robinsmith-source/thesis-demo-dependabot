import { api } from "~/trpc/server";
import EditFormHandler from "./EditFormHandler";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const recipe = await api.recipe.get.query({
    id: params.id,
  });

  if (!recipe) {
    notFound();
  }

  return <EditFormHandler recipe={recipe} />;
}
