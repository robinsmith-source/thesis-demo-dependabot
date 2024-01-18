import { Card, CardHeader } from "@nextui-org/card";
import { CardFooter, Chip, Image } from "@nextui-org/react";
import NextImage from "next/image";
import NextLink from "next/link";
import { type Prisma } from "@prisma/client";
import DifficultyChip from "~/app/_components/DifficultyChip";

export type RecipeCardProps = Prisma.RecipeGetPayload<{
  select: {
    id: true;
    name: true;
    difficulty: true;
    labels: { select: { name: true } };
    images: true;
  };
}>;

export default function RecipeCard({
  className,
  recipe,
}: {
  className?: string;
  recipe: RecipeCardProps;
}) {
  return (
    <Card
      className={`${className} group h-48 w-full sm:w-[17rem]`}
      isPressable
      isHoverable
      as={NextLink}
      href={`/recipe/${recipe.id}`}
    >
      <CardHeader className="absolute top-1 z-10 flex-col !items-start">
        <h2 className="text-lg font-semibold text-white">{recipe.name}</h2>
        <DifficultyChip difficulty={recipe.difficulty} />
      </CardHeader>

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

      {recipe.labels && (
        <CardFooter className="absolute bottom-1 z-10 flex gap-1">
          {recipe.labels.slice(0, 3).map((label) => (
            <Chip size="sm" key={label.name}>
              {label.name}
            </Chip>
          ))}
        </CardFooter>
      )}
    </Card>
  );
}
