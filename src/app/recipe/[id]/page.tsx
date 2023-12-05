import { api } from "~/trpc/server";
import React from "react";
import { Button, Chip, Image, Link } from "@nextui-org/react";
import NextImage from "next/image";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import RecipeStep from "./RecipeStep";
import IngredientTable from "./IngredientTable";
import { getServerAuthSession } from "~/server/auth";
import { FaPenToSquare } from "react-icons/fa6";

export default async function Page({ params }: { params: { id: string } }) {
  const recipe = await api.recipe.get.query({ id: params.id });
  if (!recipe) {
    notFound();
  }

  const session = await getServerAuthSession();

  return (
    <main>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            {recipe.name}
            <span className="capitalize">
              ({recipe.difficulty.toLowerCase()})
            </span>

            {recipe.authorId === session?.user.id && (
              <Button
                isIconOnly
                as={NextLink}
                color="secondary"
                href={`${params.id}/edit`}
              >
                <FaPenToSquare />
              </Button>
            )}
          </h1>

          <p>
            created by <br />
            <Link color="secondary" href={`/user/${recipe.author.id}`}>
              {recipe.author.name}
            </Link>
          </p>
          <div className="flex gap-2">
            {recipe.tags.map((tag) => (
              <Chip key={tag}>{tag}</Chip>
            ))}
          </div>
          <p>{recipe.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {recipe.images?.map((image) => (
            <Image
              as={NextImage}
              alt={`Recipe Image`}
              src={`https://utfs.io/f/${image}`}
              key={image}
              width={200}
              height={200}
            />
          ))}
        </div>
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
    </main>
  );
}
