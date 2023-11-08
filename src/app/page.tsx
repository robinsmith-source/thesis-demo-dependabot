import { api } from "~/trpc/server";
import RecipeCard from "~/app/_components/RecipeCard";

export default async function Home() {
  const featuredRecipes = await api.recipe.getFeaturedRecipes.query({
    take: 6,
  });

  return (
    <main className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {featuredRecipes ? (
          featuredRecipes.map((recipe) => (
            <RecipeCard recipeId={recipe.id} key={recipe.id} />
          ))
        ) : (
          <h2>No recipes found...</h2>
        )}
      </div>
    </main>
  );
}
