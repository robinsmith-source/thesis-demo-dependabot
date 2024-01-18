import { Button, Chip, Divider } from "@nextui-org/react";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { FaPenToSquare } from "react-icons/fa6";
import ReviewSection from "./_review/ReviewSection";
import { auth } from "auth";
import { api } from "~/trpc/server";
import ImageCarousel from "./ImageCarousel";
import DifficultyChip from "~/app/_components/DifficultyChip";
import RecipeStep from "./RecipeStep";
import RecipeAuthorSection from "./RecipeAuthorSection";
import RecipeDeleteHandler from "~/app/recipe/[id]/RecipeDeleteHandler";
import ShoppingListHandler from "~/app/recipe/[id]/ShoppingListHandler";
import { PortionSizeProvider } from "~/app/recipe/[id]/PortionSizeContext";
import RatingDisplay from "~/app/_components/RatingDisplay";
import { calculateAverage } from "~/utils/RatingCalculator";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();
  const recipe = await api.recipe.get.query({ id: params.id });
  if (!recipe) {
    notFound();
  }

  const shoppingLists = session?.user
    ? await api.shoppingList.getAllLists.query()
    : [];

  console.log(recipe.images);
  const { averageRating, totalReviews } = calculateAverage(recipe.reviews);
  return (
    <main className="space-y-6">
      <PortionSizeProvider>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div className="flex flex-col items-start justify-center gap-2">
              <div className="flex items-center justify-center gap-3">
                <h1 className="text-3xl font-bold">{recipe.name}</h1>
                <DifficultyChip difficulty={recipe.difficulty} />
              </div>

              <RatingDisplay rating={averageRating} total={totalReviews} />

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
      </PortionSizeProvider>
      <div className="mt-4 flex justify-center gap-2">
        {recipe.tags.map((tag) => (
          <Chip color="secondary" key={tag} variant="flat">
            #{tag}
          </Chip>
        ))}
      </div>

      <Divider className="my-4" />
      <RecipeAuthorSection
        currentRecipeId={params.id}
        recipeAuthor={recipe.author}
      />

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
