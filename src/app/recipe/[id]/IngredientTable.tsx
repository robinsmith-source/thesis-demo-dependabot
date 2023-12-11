"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React from "react";
import { Prisma } from "@prisma/client";
import { convertUnit } from "~/app/utils";

const recipeWithIngredients = Prisma.validator<Prisma.RecipeStepDefaultArgs>()({
  include: { ingredients: true },
});

type RecipeStepWithIngredients = Prisma.RecipeStepGetPayload<
  typeof recipeWithIngredients
>;

export default function IngredientTable({
  recipeSteps,
  className,
}: {
  recipeSteps: RecipeStepWithIngredients[];
  className?: string;
}) {
  return (
    <Table
      aria-label="Ingredient Table"
      className={`max-w-xs py-4 ${className}`}
      hideHeader
      isCompact
    >
      <TableHeader>
        <TableColumn maxWidth={40}>Amount</TableColumn>
        <TableColumn minWidth={40}>Ingredient</TableColumn>
      </TableHeader>
      <TableBody>
        {recipeSteps.flatMap((step) =>
          step.ingredients.map((ingredient) => (
            <TableRow key={ingredient.id}>
              <TableCell className="text-right">
                {ingredient.quantity} {convertUnit(ingredient.unit)}
              </TableCell>
              <TableCell>{ingredient.name}</TableCell>
            </TableRow>
          )),
        )}
      </TableBody>
    </Table>
  );
}
