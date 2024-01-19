import type { User as UserType } from "@prisma/client";
import { api } from "~/trpc/server";
import RecipeCardsSection from "~/app/_components/RecipeCardsSection";
import UserCard from "~/app/_components/UserCard";

export default async function RecipeAuthorSection({
  currentRecipeId,
  recipeAuthor,
}: {
  currentRecipeId: string;
  recipeAuthor: UserType;
}) {
  const authorsRecipe = await api.recipe.getCards.query({
    take: 3,
    excludeRecipeId: currentRecipeId,
    authorId: recipeAuthor.id,
  });

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <h2 className="text-2xl font-semibold">Recipe created by</h2>
      <UserCard user={recipeAuthor} highlightLink />

      {authorsRecipe.length > 0 && (
        <>
          <h3 className="text-xl">
            Other recipes from{" "}
            <span className="font-semibold">{recipeAuthor.name}</span>
          </h3>
          <RecipeCardsSection recipes={authorsRecipe} layout="flex" />
        </>
      )}
    </div>
  );
}
