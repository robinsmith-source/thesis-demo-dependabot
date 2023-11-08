import { api } from "~/trpc/server";
import RecipeStep from "~/app/_components/RecipeStep";
import { Card, CardHeader } from "@nextui-org/card";
import React from "react";
import { Link } from "@nextui-org/react";

export default async function Page({ params }: { params: { id: string } }) {
  const recipe = await api.recipe.get.query({ id: params.id });
  if (!recipe) {
    return <div>404</div>;
  }

  return (
    <main className="mx-auto max-w-5xl p-4">
      <Card className="h-96 w-full">
        <CardHeader className="absolute bottom-1 z-10 flex-col !items-start">
          <h1 className="text-2xl font-medium text-white">{recipe.name}</h1>
          <p className="text-white">
            created by{" "}
            <Link href={`/user/${recipe.author.id}`}>{recipe.author.name}</Link>
          </p>
        </CardHeader>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-50% to-gray-700/70"></div>
        <img src="https://placekitten.com/500/300" alt="Recipe header" />
      </Card>

      <div className="p-4">
        <p className="py-4 text-center text-xl font-medium">
          {recipe.description}
        </p>
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
    </main>
  );
}
