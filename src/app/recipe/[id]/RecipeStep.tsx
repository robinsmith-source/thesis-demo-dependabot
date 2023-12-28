import type { Prisma } from "@prisma/client";
import { convertUnit } from "../../utils";
import StepTypeChip from "~/app/_components/StepTypeChip";

type RecipeStep = Prisma.RecipeStepGetPayload<{
  include: { ingredients: true };
}>;

export default function RecipeStep({ step }: { step: RecipeStep }) {
  return (
    <tr>
      <td className="py-2 pr-4 text-right align-top lg:w-48">
        <ul>
          {step.ingredients.map((ingredient) => (
            <li key={ingredient.id}>
              {ingredient.quantity} {convertUnit(ingredient.unit)}{" "}
              {ingredient.name}
            </li>
          ))}
        </ul>
      </td>
      <td className="py-2 align-top">
          {step.duration} {step.duration === 1 ? "minute" : "minutes"}{" "}
          <StepTypeChip stepType={step.stepType} />
        <p className="font-medium">{step.description}</p>
      </td>
    </tr>
  );
}
