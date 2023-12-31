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
import { useState } from "react";
import { RecipeStepIngredient } from "@prisma/client";
import { convertUnitName } from "~/app/utils";
import { calculateIngredients, Ingredient } from "~/utils/IngredientCalculator";

export default function IngredientTable({
  className,
  ingredients,
  onSelect,
}: {
  className?: string;
  ingredients: RecipeStepIngredient[];
  onSelect: (selectedIngredients: Ingredient[]) => void;
}) {
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [portionSize, setPortionSize] = useState<number>(1);
  const summarizedIngredients = calculateIngredients(ingredients, portionSize);

  //TODO: fix ESLint error
  return (
    <>
      <Table
        aria-label="Ingredient Table"
        className={`max-w-xs py-4 ${className}`}
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={async (keys) => {
          setSelectedKeys(keys);
          if (keys !== "all") {
            onSelect(
              summarizedIngredients.filter((_, index) =>
                keys.has(index.toString()),
              ),
            );
          } else {
            onSelect(summarizedIngredients);
          }
        }}
        isCompact
      >
        <TableHeader>
          <TableColumn maxWidth={40}>Amount</TableColumn>
          <TableColumn minWidth={40}>Ingredient</TableColumn>
        </TableHeader>
        <TableBody>
          {summarizedIngredients.map((ingredient, index) => (
            <TableRow key={index}>
              <TableCell className="text-right">
                {ingredient.quantity} {convertUnitName(ingredient.unit)}
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
