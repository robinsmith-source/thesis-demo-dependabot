import { api } from "~/trpc/server";
import { auth } from "auth";
import FormHandler from "./FormHandler";
import { notFound } from "next/navigation";
import { UnauthorizedError } from "~/app/lib/exceptions";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();
  const recipe = await api.recipe.get.query({
    id: params.id,
  });

  if (!recipe) {
    notFound();
  }

  if (!session || recipe.authorId !== session.user?.id) {
    throw new UnauthorizedError();
  }

  return <FormHandler recipe={recipe} />;
}
