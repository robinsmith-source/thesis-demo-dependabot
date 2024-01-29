import { api } from "~/trpc/server";

import AdvancedRecipeSearch from "~/app/_components/search/AdvancedRecipeSearch";
import RecipeCardsSection from "~/app/_components/RecipeCardsSection";
import QueryPagination from "~/app/_components/search/QueryPagination";

type urlParams = {
  name?: string;
  labels?: string;
  difficulty?: string;
  order?: "NEWEST" | "OLDEST";
  pageSize?: string;
  page?: string;
};

type apiParams = {
  take: number;
  skip?: number;
  name?: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
  orderBy?: "NEWEST" | "OLDEST";
  labels?: string[];
};

// generate query parameters for api call
const createQueryParams = (params: urlParams) => {
  const { name, labels, difficulty, order, pageSize, page } = params;
  const numericPageSize = parseInt(pageSize ?? "12");
  const textDifficulty = ["EASY", "MEDIUM", "HARD", "EXPERT"][
    Number(difficulty) - 1
  ] as "EASY" | "MEDIUM" | "HARD" | "EXPERT";

  const queryParameters: apiParams = {
    take: numericPageSize ?? 12,
    ...(name && { name }),
    ...(labels && { labels: labels.split(",") }),
    ...(difficulty && {
      difficulty: textDifficulty,
    }),
    ...(order && { orderBy: order }),
    ...(page && { skip: (Number(page) - 1) * (numericPageSize ?? 0) }),
  };

  return queryParameters;
};

export default async function Page({
  searchParams,
}: {
  searchParams?: urlParams;
}) {
  const categories = await api.recipeLabelCategory.getAll.query();

  const queryParameters = createQueryParams(searchParams ?? {});
  const displayedRecipeCards = await api.recipe.getCards.query(queryParameters);

  // calculate page count for pagination
  const count = await api.recipe.getRecipeCount.query(queryParameters);
  const pageCount = Math.ceil(Number(count) / (queryParameters.take ?? 0));

  return (
    <main className="flex flex-col items-center">
      <AdvancedRecipeSearch categories={categories} />
      <RecipeCardsSection recipes={displayedRecipeCards} />
      {pageCount > 0 ? (
        <QueryPagination pageCount={pageCount} className="mt-2" />
      ) : null}
    </main>
  );
}
