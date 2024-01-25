import { Button, Card, CardBody, Image } from "@nextui-org/react";
import NextImage from "next/image";
import NextLink from "next/link";
import RecipeCardsSection from "~/app/_components/RecipeCardsSection";
import { FadeIn } from "~/app/lib/animations/FadeIn";
import { api } from "~/trpc/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const featuredRecipes = await api.recipe.getCards.query({
    take: 4,
    orderBy: "RATING",
  });
  const latestRecipes = await api.recipe.getCards.query({
    take: 4,
    orderBy: "NEWEST",
  });

  return (
    <main className="space-y-32">
      <section className="pt-8 md:h-full md:pt-16">
        <FadeIn>
          <Card>
            <CardBody>
              <div className="mx-4 my-8 grid grid-cols-1 place-items-center gap-6  md:grid-cols-2">
                <div className="space-y-8">
                  <h1 className="text-5xl md:text-7xl">
                    Welcome to{" "}
                    <span className="bg-gradient-to-r from-primary-500 to-accent bg-clip-text font-bold tracking-tight text-transparent">
                      GooseChef
                    </span>
                    !
                  </h1>

                  <p className="text-4xl font-semibold tracking-tight md:text-5xl">
                    The cooking website with your favourite Recipes!
                  </p>

                  <p className="text-2xl leading-7">
                    Add your own Recipes, share them with Friends and Family. Or
                    explore new Recipes from other Cooking-Enthusiasts!
                  </p>

                  <div className="flex justify-center space-x-3 md:justify-start">
                    <Button
                      className="mt-8"
                      color="primary"
                      size="lg"
                      variant="solid"
                      as={NextLink}
                      href="/recipe/create"
                    >
                      Create Recipe
                    </Button>
                    <Button
                      className="mt-8"
                      color="primary"
                      size="lg"
                      variant="ghost"
                      as={NextLink}
                      href="/shopping-list"
                    >
                      Shopping List
                    </Button>
                  </div>
                </div>

                <Image
                  as={NextImage}
                  width={500}
                  height={500}
                  priority
                  src="/images/goose_chef_paperbag.png"
                  alt="Logo"
                  className="h-120 w-120 mb-2 hidden object-contain md:block"
                />
              </div>
            </CardBody>
          </Card>
        </FadeIn>
      </section>

      <section className="space-y-24">
        <FadeIn direction="left">
          <div className="mb-4 text-start">
            <h2 className="text-4xl font-semibold">Featured Recipes</h2>
            <h2 className="text-2xl font-light text-foreground-600">
              Here are some of our favourite Recipes!
            </h2>
          </div>
          <RecipeCardsSection recipes={featuredRecipes} layout="flex" />
        </FadeIn>

        <FadeIn direction="left">
          <div className="mb-4 text-start">
            <h2 className="text-4xl font-semibold"> Latest Recipes </h2>
            <h2 className="text-2xl font-light text-foreground-600">
              Here are some of our latest Recipes!
            </h2>
          </div>
          <RecipeCardsSection recipes={latestRecipes} layout="flex" />
        </FadeIn>
      </section>
    </main>
  );
}
