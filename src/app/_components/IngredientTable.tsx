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
import type { Selection } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { convertUnitName } from "~/app/utils";
import {
  calculateIngredients,
  type Ingredient,
} from "~/utils/IngredientCalculator";
import type { Unit } from "@prisma/client";

export default function IngredientTable({
  className,
  isSelectable = false,
  isPortionable = false,
  removeWrapper = false,
  ingredients,
  onSelect,
}: {
  className?: string;
  isSelectable?: boolean;
  isPortionable?: boolean;
  removeWrapper?: boolean;
  ingredients: {
    id: string;
    quantity: number;
    unit: Unit;
    name: string;
  }[];
  onSelect?: (selectedIngredients: Ingredient[]) => void;
}) {
  const [portionSize, setPortionSize] = useState<number>(1);
  const summarizedIngredients = calculateIngredients(ingredients, portionSize);

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const [shouldEmitSelection, setShouldEmitSelection] =
    useState<boolean>(false);

  const selectedIngredients =
    selectedKeys === "all"
      ? summarizedIngredients
      : summarizedIngredients.filter((_, index) =>
          selectedKeys.has(index.toString()),
        );

  useEffect(() => {
    if (!shouldEmitSelection) return;
    if (onSelect) {
      onSelect(selectedIngredients);
    }
    setShouldEmitSelection(false);
  }, [selectedIngredients, shouldEmitSelection, onSelect]);

  useEffect(() => {
    if (isSelectable) {
      setSelectedKeys(new Set());
    }
  }, [summarizedIngredients.map((ingredient) => ingredient.id).join(",")]);

  function handleSelect(keys: Selection) {
    setSelectedKeys(keys);
    setShouldEmitSelection(true);
  }

  return (
    <>
      <Table
        aria-label="Ingredient Table"
        className={`max-w-xs ${className}`}
        selectionMode={isSelectable ? "multiple" : "none"}
        removeWrapper={removeWrapper}
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelect}
        isCompact
        isStriped
      >
        <TableHeader>
          <TableColumn maxWidth={40} className="text-right">
            Amount
          </TableColumn>
          <TableColumn minWidth={40}>Ingredient</TableColumn>
        </TableHeader>
        <TableBody>
          {summarizedIngredients.map((ingredient, index) => (
            <TableRow key={index}>
              <TableCell className="text-right">
                {`${ingredient.quantity} ${convertUnitName(ingredient.unit)}`}
              </TableCell>
              <TableCell>{ingredient.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isPortionable && (
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
      )}
    </>
  );
}
