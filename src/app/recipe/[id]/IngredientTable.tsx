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
import type { RecipeStepIngredient } from "@prisma/client";
import { convertUnitName } from "~/app/utils";
import {
  calculateIngredients,
  type Ingredient,
} from "~/utils/IngredientCalculator";

export default function IngredientTable({
  className,
  isSelectable = false,
  ingredients,
  onSelect,
}: {
  className?: string;
  isSelectable?: boolean;
  ingredients: RecipeStepIngredient[];
  onSelect: (selectedIngredients: Ingredient[]) => void;
}) {
  const [selectedKeys, setSelectedKeys] = useState<"all" | Set<string>>(
    new Set<string>(),
  );

  const [portionSize, setPortionSize] = useState<number>(1);
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>(
    [],
  );
  const summarizedIngredients = calculateIngredients(ingredients, portionSize);

  function handleSelect() {
    if (selectedKeys === "all") {
      setSelectedIngredients(summarizedIngredients);
    } else {
      setSelectedIngredients(
        summarizedIngredients.filter((_, index) =>
          selectedKeys.has(index.toString()),
        ),
      );
    }
    onSelect(selectedIngredients);
  }

  return (
    <>
      <Table
        aria-label="Ingredient Table"
        className={`max-w-xs ${className}`}
        selectionMode={isSelectable ? "multiple" : "none"}
        selectedKeys={selectedKeys}
        onSelectionChange={(keys) => {
          //@ts-expect-error TODO: Fix this
          setSelectedKeys(keys);
          handleSelect();
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
