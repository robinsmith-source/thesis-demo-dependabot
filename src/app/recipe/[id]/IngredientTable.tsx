"use client";
import {
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React, { useState } from "react";
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
  const [portionSize, setPortionSize] = useState<number>();

  return (
    <>
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
                  {ingredient.quantity * portionSize}{" "}
                  {convertUnit(ingredient.unit)}
                </TableCell>
                <TableCell>{ingredient.name}</TableCell>
              </TableRow>
            )),
          )}
        </TableBody>
      </Table>

      <Input
        onValueChange={(value) => {
          console.log(value);
          setPortionSize(parseInt(value));
        }}
        size="sm"
        type="number"
        min={0}
        defaultValue={portionSize + ""}
        placeholder="requiered portion"
        className="w-40"
      />
    </>
  );
}
