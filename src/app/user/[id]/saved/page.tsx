import { auth } from "auth";
import { notFound } from "next/navigation";
import RecipeCardsSection from "~/app/_components/RecipeCardsSection";
import { api } from "~/trpc/server";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();

  if (session?.user?.id !== params.id) {
    return notFound();
  }

  const userRecipes = await api.recipe.getCards.query({
    take: 20,
    savedFeedUserId: params.id,
  });

  return <RecipeCardsSection recipes={userRecipes} />;
}
