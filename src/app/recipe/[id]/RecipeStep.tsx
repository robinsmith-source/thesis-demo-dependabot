"use client";
import type { Prisma } from "@prisma/client";
import { convertUnitName } from "~/app/utils";
import { calculateIngredients } from "~/utils/IngredientCalculator";
import { usePortionSize } from "~/app/recipe/[id]/PortionSizeContext";

type RecipeStep = Prisma.RecipeStepGetPayload<{
  include: { ingredients: true };
}>;

export default function RecipeStep({ step }: { step: RecipeStep }) {
  const { portionSize } = usePortionSize();
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
        <div className="pt-0.5 text-gray-500">
          {step.duration} {step.duration === 1 ? "minute" : "minutes"}{" "}
          <span className="capitalize">({step.stepType.toLowerCase()})</span>
        </div>
      </td>
    </tr>
  );
}
