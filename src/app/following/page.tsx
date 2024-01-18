import { api } from "~/trpc/server";
import RecipeCardsSection from "~/app/_components/RecipeCardsSection";

export const dynamic = "force-dynamic";

export default async function Following() {
  const latestRecipes = await api.recipe.getCards.query({
    take: 20,
    isFollowingFeed: true,
  });

  return (
    <main>
      <RecipeCardsSection recipes={latestRecipes} />
    </main>
  );
}
