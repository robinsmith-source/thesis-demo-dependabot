import { api } from "~/trpc/server";
import React from "react";
import { Card, Chip, Divider, Image, Link } from "@nextui-org/react";
import NextImage from "next/image";
import { notFound } from "next/navigation";
import RecipeStep from "./RecipeStep";
import IngredientTable from "./IngredientTable";
import ReviewSection from "~/app/recipe/[id]/_review/ReviewSection";

export default async function Page({ params }: { params: { id: string } }) {
  const recipe = await api.recipe.get.query({ id: params.id });
  if (!recipe) {
    notFound();
  }

  return (
    <main>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <h1 className="text-2xl font-bold">
            {recipe.name} (
            <span className="capitalize">
              {recipe.difficulty.toLowerCase()}
            </span>
            )
          </h1>
          <p>
            created by{" "}
            <Link color="secondary" href={`/user/${recipe.author.id}`}>
              {recipe.author.name}
            </Link>
          </p>

          <div className="my-2 flex gap-2">
            {recipe.labels.map((label) => (
              <Chip key={label.id}>{label.name}</Chip>
            ))}
          </div>
          <p>{recipe.description}</p>
        </div>
        <Card className="row-span-2 h-96 place-self-center">
          <Image
            as={NextImage}
            priority
            width={500}
            height={300}
            removeWrapper
            alt="recipe header"
            className="z-0 h-full w-full object-cover"
            src="https://placekitten.com/500/300"
          />
        </Card>
        <IngredientTable recipeSteps={recipe.steps} />
      </div>

      <div>
        <table>
          <thead>
            <tr>
              <th className="pr-4 text-right">Ingredients</th>
            </tr>
          </thead>
          <tbody>
            {recipe.steps.map((step) => (
              <RecipeStep step={step} key={step.id} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {recipe.tags.map((tag) => (
          <Chip key={tag}>#{tag}</Chip>
        ))}
      </div>

      <Divider className="my-4" />
      <ReviewSection recipeId={recipe.id} />
    </main>
  );
}
