import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import FormHandler from "./FormHandler";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();
  const recipe = await api.recipe.get.query({
    id: params.id,
  });

  //TODO: Implement proper handling for that
  if (!recipe || !session || recipe.authorId !== session?.user.id) {
    return "NOIDONTTHINKSO";
  }

  return <FormHandler recipe={recipe} />;
}
