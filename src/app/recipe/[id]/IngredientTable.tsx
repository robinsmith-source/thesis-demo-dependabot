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
import { Prisma, Unit } from "@prisma/client";
import { convertUnit } from "~/app/utils";

const recipeWithIngredients = Prisma.validator<Prisma.RecipeStepDefaultArgs>()({
  include: { ingredients: true },
});

type RecipeStepWithIngredients = Prisma.RecipeStepGetPayload<
  typeof recipeWithIngredients
>;

type Ingredient = {
  name: string;
  quantity: number;
  unit: Unit | null;
};

export default function IngredientTable({
  recipeSteps,
  className,
}: {
  recipeSteps: RecipeStepWithIngredients[];
  className?: string;
}) {
  const [portionSize, setPortionSize] = useState<number>(1);

  const ingredientMap = new Map<string, Ingredient>();

  recipeSteps.forEach((step) => {
    step.ingredients.forEach((ingredient) => {
      const key = `${ingredient.name.toUpperCase()}-${ingredient.unit || ""}`;
      const existingIngredient = ingredientMap.get(key);

      if (existingIngredient) {
        existingIngredient.quantity += ingredient.quantity * portionSize;
      } else {
        ingredientMap.set(key, {
          ...ingredient,
          quantity: ingredient.quantity * portionSize,
        });
      }
    });
  });
  const summedIngredients = Array.from(ingredientMap.values());

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
          {summedIngredients.map((ingredient, index) => (
            <TableRow key={index}>
              <TableCell className="text-right">
                {ingredient.quantity} {convertUnit(ingredient.unit)}
              </TableCell>
              <TableCell>{ingredient.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Input
        onValueChange={(value) => {
          setPortionSize(parseInt(value));
        }}
        size="sm"
        type="number"
        min={1}
        defaultValue={portionSize + ""}
        placeholder="required portion"
        className="w-40"
      />
    </>
  );
}
