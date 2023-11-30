import { api } from "~/trpc/server";
import RecipeCard from "~/app/_components/RecipeCard";
import NextImage from "next/image";

export default async function Page({ params }: { params: { id: string } }) {
  const user = await api.user.get.query({ id: params.id });
  if (!user) {
    return <div>404</div>;
  }

  return (
    <main>
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {user.recipes.map((recipe) => (
          <RecipeCard recipeId={recipe.id} key={recipe.id} />
        ))}
      </div>
    </main>
  );
}
