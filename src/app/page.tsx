import { api } from "~/trpc/server";
import { Divider, Image } from "@nextui-org/react";
import NextImage from "next/image";
import RecipeCardsSection from "~/app/_components/RecipeCardsSection";

export const dynamic = "force-dynamic";

export default async function Home() {
  const latestRecipes = await api.recipe.getCards.query({
    take: 20,
  });

  return (
    <main className="flex flex-col items-center">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="ml-5">
          <h1 className="text-7xl font-bold">Welcome to Goose Chef!</h1>
          <p className="mt-8 text-4xl font-semibold">
            The cooking website with your favourite Recipes!
          </p>
          <p className="mt-8 text-2xl">
            Add your own Recipes, share them with Friends and Family. Or explore
            new Recipes from other Cooking-Enthusiasts!
          </p>
        </div>
        <div className="mb-4 flex justify-center">
          {/* Goose chef logo */}
          <Image
            as={NextImage}
            width={500}
            height={500}
            src="/images/goose_chef_paperbag.png"
            alt="Logo"
            className="h-120 w-120 mb-2 object-contain"
          />
        </div>
      </div>
      <Divider className="my-4" />
      <RecipeCardsSection recipes={latestRecipes} />
    </main>
  );
}
