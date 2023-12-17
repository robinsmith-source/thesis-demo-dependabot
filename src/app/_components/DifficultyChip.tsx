import { RecipeDifficulty } from "@prisma/client";
import { ReactNode } from "react";
import { FaCrown } from "react-icons/fa";
import { Chip } from "@nextui-org/react";

const difficultyToNumber = { EASY: 1, MEDIUM: 2, HARD: 3, EXPERT: 4 };
export default function DifficultyChip({
  difficulty,
}: {
  difficulty: RecipeDifficulty;
}): ReactNode {
  const difficultyInNumber = difficultyToNumber[difficulty];
  return (
    <Chip>
      {Array.from(Array(difficultyInNumber), () => (
        <FaCrown key={difficultyInNumber} className={"mr-1 inline last:mr-0"} />
      ))}
    </Chip>
  );
}
