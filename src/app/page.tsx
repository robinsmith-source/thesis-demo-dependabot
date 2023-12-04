import { api } from "~/trpc/server";
import RecipeCard from "~/app/_components/RecipeCard"
import {Image, Input} from '@nextui-org/react';
import NextImage from 'next/image';

export default async function Home() {
  const featuredRecipes = await api.recipe.getRecipesAdvanced.query({
      take: 6,
      tags: [],
      author: "testUser"
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
                    className="w-24 h-24 mb-2 object-contain"
                />
            </div>
            <div className="w-full md:w-1/2 mb-4">
                <Input
                    type="text"
                    //value={searchQuery}
                    //onChange={(e) => setSearchQuery(e.target.value)}
                    //onKeyPress={handleKeyPress}
                    placeholder="Search recipes..."
                    //bordered
                    //size="large"
                    fullWidth
                />
            </div>
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
