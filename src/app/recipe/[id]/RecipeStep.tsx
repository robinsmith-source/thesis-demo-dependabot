import type { Prisma } from "@prisma/client";
import { convertUnit } from "../../utils";
import { Chip } from "@nextui-org/react";

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
        <Chip
          size="sm"
          classNames={{
            base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
            content: "drop-shadow shadow-black text-white",
          }}
        >
          {step.stepType.toLowerCase()}
        </Chip>
        <p className="text-black-foreground text-sm font-bold">
          {step.duration} {step.duration === 1 ? "minute" : "minutes"}{" "}
        </p>
        <p className="font-medium">{step.description}</p>
      </td>
    </tr>
  );
}
