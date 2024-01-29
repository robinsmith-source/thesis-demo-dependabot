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
import RecipeSaveButton from "./RecipeSaveButton";

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
        <div className="flex flex-col">
          <div className="flex flex-col items-start justify-between gap-2">
            <div className="flex w-full items-center justify-between  gap-16">
              <span className="flex flex-col items-start gap-2 md:flex-row md:items-center">
                <h1 className="text-wrap text-3xl font-bold">{recipe.name}</h1>
                <DifficultyChip difficulty={recipe.difficulty} />
              </span>
              {recipe.authorId === session?.user?.id && (
                <div className="flex gap-3">
                  <Button
                    isIconOnly
                    as={NextLink}
                    color="secondary"
                    href={`${params.id}/edit`}
                  >
                    <FaPenToSquare />
                  </Button>
                  <RecipeDeleteHandler recipeId={recipe.id} />
                </div>
              )}
            </div>
            <RatingDisplay rating={averageRating} total={totalReviews} />
          </div>
          <div className="my-2 flex flex-wrap gap-2">
            {recipe.labels.map((label) => (
              <Chip key={label.id}>{label.name}</Chip>
            ))}
          </div>

          <p>{recipe.description}</p>
          <Divider className="my-4" />

          <div
            className={`flex flex-col items-center justify-center gap-6 md:flex-row md:justify-evenly md:gap-12`}
          >
            {recipe.images.length > 0 && (
              <ImageCarousel images={recipe.images} className="md:order-1" />
            )}
            <ShoppingListHandler
              isAuthorized={!!session?.user}
              shoppingLists={shoppingLists}
              ingredients={recipe.steps.flatMap((step) => step.ingredients)}
            />
          </div>
          <Divider className="my-4" />
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
      {session?.user && (
        <RecipeSaveButton
          recipeId={recipe.id}
          isSaved={recipe.savedUsers.length > 0}
          savedCount={recipe._count.savedUsers}
        />
      )}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
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
