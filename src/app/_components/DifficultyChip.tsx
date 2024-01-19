import { type RecipeDifficulty } from "@prisma/client";
import { type ReactNode } from "react";
import { Chip } from "@nextui-org/react";
import { RiKnifeFill } from "react-icons/ri";

const difficultyToNumber = { EASY: 1, MEDIUM: 2, HARD: 3, EXPERT: 4 };
export default function DifficultyChip({
  difficulty,
}: {
  difficulty: RecipeDifficulty;
}): ReactNode {
  const difficultyInNumber = difficultyToNumber[difficulty];
  return (
    <Chip className="flex gap-1" size="sm">
      {Array.from(Array(difficultyInNumber), () => (
        <RiKnifeFill
          key={difficultyInNumber}
          className="mr-1 inline last:mr-0"
        />
      ))}
    </Chip>
  );
}
