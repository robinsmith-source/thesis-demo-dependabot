import RecipeCard, { RecipeCardProps } from "~/app/_components/RecipeCard";

export default function RecipeCardsSection({
  className,
  recipes,
}: {
  className?: string;
  recipes: RecipeCardProps[];
}) {
  return (
    <section
      className={`${className} grid grid-cols-1 items-center justify-center gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}
    >
      {recipes &&
        recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
    </section>
  );
}
