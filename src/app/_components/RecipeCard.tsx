import { Card, CardHeader } from "@nextui-org/card";
import { CardFooter, Chip, Image } from "@nextui-org/react";
import NextImage from "next/image";
import NextLink from "next/link";
import DifficultyChip from "~/app/_components/DifficultyChip";
import RatingDisplay from "~/app/_components/RatingDisplay";
import { calculateAverage } from "~/utils/RatingCalculator";
import { type RouterOutputs } from "~/trpc/shared";



export default function RecipeCard({
  className,
  recipe,
}: {
  className?: string;
  recipe: RouterOutputs["recipe"]["getCards"][0];
}) {
  const { averageRating } = calculateAverage(recipe.reviews);

  return (
    <Card
      className={`${className} group h-48 w-full sm:w-[17rem]`}
      isPressable
      isHoverable
      as={NextLink}
      href={`/recipe/${recipe.id}`}
    >
      <CardHeader className="absolute top-1 z-10 flex-col !items-start space-y-1">
        <div className="flex w-full justify-between gap-2">
          <DifficultyChip difficulty={recipe.difficulty} />
          <RatingDisplay size={20} rating={averageRating} isMinimalistic />
        </div>
        <h2 className="text-lg font-semibold text-white">{recipe.name}</h2>
      </CardHeader>

      {recipe.images.length > 0 ? (
        <Image
          removeWrapper
          as={NextImage}
          width={300}
          height={300}
          src={`https://utfs.io/f/${recipe.images[0]}`}
          alt=""
          aria-hidden
          className="z-0 h-full w-full bg-center object-cover brightness-[.60] transition duration-200 ease-in-out group-hover:scale-110"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-primary-100 to-primary-500 brightness-[.70] transition duration-200 ease-in-out group-hover:brightness-[.50]"></div>
      )}

      {recipe.labels && (
        <CardFooter className="absolute bottom-1 z-10 flex gap-1">
          {recipe.labels.slice(0, 3).map((label) => (
            <Chip size="sm" key={label.name}>
              {label.name}
            </Chip>
          ))}
          {recipe.labels.length > 3 && <Chip>+{recipe.labels.length - 3}</Chip>}
        </CardFooter>
      )}
    </Card>
  );
}
