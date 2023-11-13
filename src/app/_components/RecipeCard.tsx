import React from "react";
import Link from "next/link";
import { api } from "~/trpc/server";
import { Card, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/react";
import NextImage from "next/image";

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
        <Image
          as={NextImage}
          width={300}
          height={300}
          src="https://placekitten.com/500/300"
          alt="Card background"
          className="z-0 h-full w-full object-cover brightness-75"
        />
      </Card>
    </Link>
  );
}
