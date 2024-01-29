"use client";
import { Chip } from "@nextui-org/react";

import { convertUnitName } from "~/app/utils";
import { calculateIngredients } from "~/utils/IngredientCalculator";
import { usePortionSize } from "~/app/recipe/[id]/PortionSizeContext";

import { RecipeStepType } from "@prisma/client";
import type { RouterOutputs } from "~/trpc/shared";

export default function RecipeStep({
  step,
}: {
  step: RouterOutputs["recipe"]["get"]["steps"][0];
}) {
  const { portionSize } = usePortionSize();
  const stepTypeColor = (step: RecipeStepType) => {
    switch (step) {
      case RecipeStepType.PREP:
        return "bg-green-500/60";
      case RecipeStepType.MIX:
        return "bg-teal-600/60";
      case RecipeStepType.COOK:
        return "bg-amber-500/60";
      case RecipeStepType.REST:
        return "bg-orange-500/60";
      case RecipeStepType.SEASON:
        return "bg-purple-500/60";
      case RecipeStepType.SERVE:
        return "bg-fuchsia-800/60";
      default:
        return "default";
    }
  };

  return (
    <tr>
      <td className="py-2 pr-4 text-right align-top lg:w-48">
        <ul>
          {calculateIngredients(step.ingredients, portionSize).map(
            (ingredient) => (
              <li key={ingredient.id}>
                {ingredient.quantity} {convertUnitName(ingredient.unit)}{" "}
                {ingredient.name}
              </li>
            ),
          )}
        </ul>
      </td>
      <td className="py-2 align-top">
        <p className="font-medium">{step.description}</p>
        <div className="flex items-center gap-2">
          <p className="pt-0.5 text-sm text-foreground-500">
            {step.duration} {step.duration === 1 ? "minute" : "minutes"}{" "}
          </p>
          <Chip
            variant="flat"
            size="sm"
            classNames={{
              base: stepTypeColor(step.stepType),
              content: "text-white",
            }}
          >
            {step.stepType.toLowerCase()}
          </Chip>
        </div>
      </td>
    </tr>
  );
}
