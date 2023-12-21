import { Chip } from "@nextui-org/react";
import { type RecipeStepType } from "@prisma/client";

export default function StepTypeChip({
  stepType,
}: {
  stepType: RecipeStepType;
}) {
  return <Chip className="capitalize">{stepType.toLowerCase()}</Chip>;
}
