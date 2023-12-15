import { api } from "~/trpc/server";
import RecipeCard from "~/app/_components/RecipeCard";
import RecipeSearchBar from "~/app/_components/RecipeSearchBar";
import { Recipe } from "@prisma/client";

export default async function Page() {
  //query gets adjusted with the information provided from the client component --> as search query

  const displayedRecipes = await api.recipe.getRecipesAdvanced.query({
    take: 20,
  });

  const handleSearch = async (searchQuery: string) => {
    const result = await api.recipe.getRecipesAdvanced.query({
      take: 20,
      name: searchQuery,
    });
    return result;
  };
  return (
    <main className="flex flex-col items-center">
      {/* Here should be the search component as a client component */}
      <RecipeSearchBar onSearch={handleSearch} />
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {handleSearch ? (
          handleSearch.map((recipe: Recipe) => (
            <RecipeCard recipeId={recipe.id} key={recipe.id} />
          ))
        ) : (
          <h2>No recipes found...</h2>
        )}
      </div>
    </main>
  );
}
