import { Link, User } from "@nextui-org/react";
import React from "react";
import type { User as UserType } from "@prisma/client";
import { api } from "~/trpc/server";
import RecipeCard from "~/app/_components/RecipeCard";

export default async function RecipeAuthorSection({
  currentRecipeId,
  recipeAuthor,
}: {
  currentRecipeId: string;
  recipeAuthor: UserType;
}) {
  const authorsRecipe = await api.recipe.getRecipesAdvanced.query({
    take: 3,
    authorId: recipeAuthor.id,
  });
  console.log(authorsRecipe);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <h2 className="text-2xl font-semibold">Recipe created by</h2>
      <User
        className="flex gap-4"
        name={
          <Link
            color="secondary"
            href={`/user/${recipeAuthor.id}`}
            showAnchorIcon
            size="md"
          >
            {recipeAuthor.name}
          </Link>
        }
        avatarProps={{
          isBordered: true,
          as: "button",
          color: "secondary",
          size: "md",
          src: recipeAuthor.image ?? undefined,
        }}
      />

      {authorsRecipe && (
        <>
          <h3 className="text-xl font-medium">
            Other recipes from {recipeAuthor.name}
          </h3>
          <div className="flex items-center justify-center gap-4">
            {authorsRecipe.map((recipe) => (
              <RecipeCard recipeId={recipe.id} key={recipe.id} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
