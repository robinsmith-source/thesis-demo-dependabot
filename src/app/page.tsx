import { api } from "~/trpc/server";
import { Image } from "@nextui-org/react";
import NextImage from "next/image";
import RecipeCardsSection from "~/app/_components/RecipeCardsSection";

export const dynamic = "force-dynamic";

export default async function Home() {
  const latestRecipes = await api.recipe.getCards.query({
    take: 20,
  });

  return (
    <main className="flex flex-col items-center">
      <div className="mb-4">
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
      <RecipeCardsSection recipes={latestRecipes} />
    </main>
  );
}
