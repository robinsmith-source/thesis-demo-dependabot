import React from "react";
import { api } from "~/trpc/server";
import { Card, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/react";
import NextImage from "next/image";
import NextLink from "next/link";
import { notFound } from "next/navigation";

export default async function RecipeCard({ recipeId }: { recipeId: string }) {
  const recipe = await api.recipe.getRecipePreview.query({ id: recipeId });

  if (!recipe) {
    return notFound();
  }
  return (
    <Card
      className="h-48 w-64"
      isPressable
      isHoverable
      as={NextLink}
      href={`/recipe/${recipe.id}`}
    >
      <CardHeader className="absolute top-1 z-10 flex-col !items-start">
        <h2 className="text-lg font-medium text-white">{recipe.name}</h2>
        <p className="text-left text-white/90">{recipe.description}</p>
      </CardHeader>
      <Image
        removeWrapper
        as={NextImage}
        width={300}
        height={300}
        src={`https://utfs.io/f/${recipe.images[0]}`}
        alt=""
        aria-hidden
        className="z-0 h-full w-full bg-center object-cover brightness-[.60]"
      />
    </Card>
  );
}
