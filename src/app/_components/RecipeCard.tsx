import React from "react";
import Link from "next/link";
import { api } from "~/trpc/server";
import { Card, CardHeader } from "@nextui-org/card";

export default async function RecipeCard({ recipeId }: { recipeId: string }) {
  const recipe = await api.recipe.getRecipePreview.query({ id: recipeId });

  if (!recipe) {
    return null;
  }
  return (
    <Link href={`/recipe/${recipe.id}`}>
      <Card isPressable isHoverable>
        <CardHeader className="absolute top-1 z-10 flex-col !items-start">
          <h2 className="text-lg font-medium text-white">{recipe.name}</h2>
          <p className="text-left text-white/80">{recipe.description}</p>
        </CardHeader>
        <img
          src="https://placekitten.com/500/200"
          alt="Card background"
          className="z-0 h-full w-full object-cover brightness-75"
        />
      </Card>
    </Link>
  );
}
