import { Button, Chip, Divider, Link } from "@nextui-org/react";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { FaPenToSquare } from "react-icons/fa6";
import ReviewSection from "./_review/ReviewSection";
import { auth } from "auth";
import { api } from "~/trpc/server";
import ImageCarousel from "./ImageCarousel";
import RecipeStep from "./RecipeStep";
import RecipeDeleteHandler from "~/app/recipe/[id]/RecipeDeleteHandler";
import ShoppingListHandler from "~/app/recipe/[id]/ShoppingListHandler";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();
  const recipe = await api.recipe.get.query({ id: params.id });
  if (!recipe) {
    notFound();
  }

  let shoppingLists = [] as {
    id: string;
    name: string;
  }[];

  if (session?.user) {
    shoppingLists = await api.shoppingList.getAllLists.query();
  }

  console.log(recipe.images);
  return (
    <main className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <div className="flex items-center gap-x-2">
            <h1 className="text-2xl font-bold">{recipe.name}</h1>

            <span className="capitalize">
              ({recipe.difficulty.toLowerCase()})
            </span>

            {recipe.authorId === session?.user?.id && (
              <>
                <Button
                  isIconOnly
                  as={NextLink}
                  color="secondary"
                  href={`${params.id}/edit`}
                >
                  <FaPenToSquare />
                </Button>
                <RecipeDeleteHandler recipeId={recipe.id} />
              </>
            )}
          </div>

          <p>
            created by <br />
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
        <ImageCarousel images={recipe.images} />
        <ShoppingListHandler
          isAuthorized={!!session?.user}
          shoppingLists={shoppingLists}
          ingredients={recipe.steps.flatMap((step) => step.ingredients)}
        />
      </div>
      <Divider className="my-4" />
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
      <ReviewSection
        recipeId={recipe.id}
        hideReviewForm={
          recipe.author.id === session?.user?.id || session == null
        }
      />
    </main>
  );
}
