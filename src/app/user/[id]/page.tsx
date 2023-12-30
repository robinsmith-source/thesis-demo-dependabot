import { api } from "~/trpc/server";
import NextImage from "next/image";
import RecipeCardsSection from "~/app/_components/RecipeCardsSection";

export default async function Page({ params }: { params: { id: string } }) {
  const user = await api.user.get.query({ id: params.id });
  const userRecipes = await api.recipe.getRecipeCards.query({
    take: 20,
    authorId: params.id,
  });

  if (!user) {
    return <div>404</div>;
  }

  return (
    <main className="flex flex-col space-y-4">
      <div className="flex items-center gap-4 py-4">
        {user.image && (
          <NextImage
            src={user.image}
            alt="profile picture"
            width={64}
            height={64}
            className="rounded-full"
          />
        )}
        <div>
          <h1 className="text-lg font-bold">{user.name}</h1>
          <p>Created {user.recipes.length} recipes</p>
        </div>
      </div>
      <RecipeCardsSection recipes={userRecipes} />
    </main>
  );
}
