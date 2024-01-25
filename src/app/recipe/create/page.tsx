import CreateFormHandler from "~/app/recipe/create/CreateFormHandler";
import { auth } from "auth";

export default async function RecipeCreate() {
  const session = await auth();

  return <CreateFormHandler userId={session?.user?.id} />;
}
