import { api } from "~/trpc/server";
import RecipeCardsSection from "~/app/_components/RecipeCardsSection";

export default async function Page({ params }: { params: { id: string } }) {
  const userRecipes = await api.recipe.getCards.query({
    take: 20,
    authorId: params.id,
  });

  return <RecipeCardsSection recipes={userRecipes} />;
}
