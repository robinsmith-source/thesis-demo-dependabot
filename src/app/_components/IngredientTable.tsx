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
import { convertUnitName } from "~/app/utils";
import {
  calculateIngredients,
  type Ingredient,
} from "~/utils/IngredientCalculator";
import { Unit } from "@prisma/client";

export default function IngredientTable({
  className,
  isSelectable = false,
  isPortionable = false,
  ingredients,
  onSelect = () => {},
}: {
  className?: string;
  isSelectable?: boolean;
  isPortionable?: boolean;
  ingredients: {
    id: string;
    quantity: number;
    unit: Unit;
    name: string;
  }[];
  onSelect?: (selectedIngredients: Ingredient[]) => void;
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
