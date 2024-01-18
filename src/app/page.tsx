import { api } from "~/trpc/server";
import { Image } from "@nextui-org/react";
import NextImage from "next/image";
import SimpleRecipeSearch from "./_components/search/SimpleRecipeSearch";
import RecipeCardsSection from "~/app/_components/RecipeCardsSection";

export const dynamic = "force-dynamic";

export default async function Home() {
  const latestRecipes = await api.recipe.getCards.query({
    take: 20,
  });

  return (
    <main className="flex flex-col items-center">
      <div className="mb-6 hidden md:block">
        {/* Goose chef logo */}
        <Image
          as={NextImage}
          width={100}
          height={100}
          src="/images/Logo_round_V2.png"
          alt="Logo"
          className="mb-2 h-24 w-24 object-contain"
        />
      </div>
      <div className="mb-4 w-full md:w-1/2">
        <SimpleRecipeSearch />
      </div>
      <RecipeCardsSection recipes={latestRecipes} />
    </main>
  );
}
