import { api } from "~/trpc/server";
import RecipeCard from "~/app/_components/RecipeCard";

import { type Recipe, PrismaClient } from "@prisma/client";
import AdvancedRecipeSearch from "~/app/_components/search/AdvancedRecipeSearch";
import FilterAccordion from "~/app/_components/search/FilterAccordion";

type Label = {
  name: string;
  category: {
    name: string;
  };
};

type LabelCategory = {
  name: string;
};


type urlParams = {
  name?: string;
  labels?: string;
};

type apiParams = {
  take?: number;
  skip?: number;
  name?: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
  labels?: string[];
  tags?: string;
  author?: string;
  orderByName?: "NEWEST" | "OLDEST";
  groupBy?: "NONE" | "LABELS";
};

// translate parameters
const createQueryParameters = (params: urlParams) => {
  const { name, labels } = params;
  const queryParameters: apiParams = { take: 20 };

  if (name) queryParameters.name = name;
  if (labels) queryParameters.labels = labels.split(",");

  return queryParameters;
};


export default async function Page({ searchParams }: { searchParams?: urlParams }) {
  const prisma = new PrismaClient();
  const queryParameters = createQueryParameters(searchParams ?? {});

  //adjust api query with filters provided client components
  const displayedRecipes = await api.recipe.getRecipesAdvanced.query(queryParameters);

  //get all labels from DB for autocomplete items
  const allLabelNames: Label[] = await prisma.recipeLabel.findMany({
    select: { name: true, category: { select: { name: true } } },
  });

  //get all label categories from DB for autocomplete sections
  const allLabelCategories: LabelCategory[] =
    await prisma.recipeLabelCategory.findMany({
      select: { name: true },
    });

  return (
    <main className="flex flex-col items-center">
      <div className="flex w-full flex-row items-center justify-between">
        <AdvancedRecipeSearch />
      </div>
      <FilterAccordion labels={allLabelNames} categories={allLabelCategories}/>
      {displayedRecipes && displayedRecipes.length > 0 ? (
        <div className="mt-6 grid h-full w-full grid-cols-1 place-items-center gap-4 md:grid-cols-2 lg:grid-cols-4">
          {displayedRecipes.map((recipe: Recipe) => (
            <RecipeCard recipeId={recipe.id} key={recipe.id} />
          ))}
        </div>
      ) : (
        <div className="mt-20 flex items-center justify-center">
          <h2 className="text-center text-3xl font-bold text-warning-400">
            Oh no! You&apos;ll starve!
          </h2>
        </div>
      )}
    </main>
  );
}
