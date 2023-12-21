import { api } from "~/trpc/server";
import { Chip, Divider, Link } from "@nextui-org/react";
import { notFound } from "next/navigation";
import RecipeStep from "./RecipeStep";
import IngredientTable from "./IngredientTable";
import ReviewSection from "~/app/recipe/[id]/_review/ReviewSection";
import { getServerAuthSession } from "~/server/auth";
import ImageCarousel from "./ImageCarousel";
import DifficultyChip from "~/app/_components/DifficultyChip";

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
              <div className="flex flex-row gap-1">
                  <h1 className="inline-block text-2xl font-bold">
                  {recipe.name}
              </h1>
                  <DifficultyChip difficulty={recipe.difficulty}/>
              </div>
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
          <ImageCarousel images={recipe.images}/>
          <IngredientTable recipeSteps={recipe.steps}/>
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
      <ReviewSection
        recipeId={recipe.id}
        showReviewForm={recipe.author.id !== session?.user.id}
      />
    </main>
  );
}
