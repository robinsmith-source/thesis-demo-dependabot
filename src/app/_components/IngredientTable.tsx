"use client";
import { Button, CardFooter, Selection } from "@nextui-org/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { convertUnitName } from "~/app/utils";
import {
  calculateIngredients,
  type Ingredient,
} from "~/utils/IngredientCalculator";
import type { Unit } from "@prisma/client";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { motion } from "framer-motion";

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

  const [animation, setAnimation] = useState({ x: 0 });

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

  const ingredientsIds = summarizedIngredients
    .map((ingredient) => ingredient.id)
    .join(",");
  useEffect(() => {
    if (isSelectable) {
      setSelectedKeys(new Set());
    }
  }, [isSelectable, ingredientsIds]);

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
        <CardFooter className="flex w-full justify-between">
          <Button
            isIconOnly
            onPress={() => {
              setPortionSize((portionSize) => portionSize - 1);
              setAnimation({
                x: -30,
              });
            }}
            isDisabled={portionSize <= 1}
            className="duration-300 hover:scale-110 hover:bg-primary"
          >
            <FaMinus />
          </Button>
          <motion.span
            key={portionSize}
            initial={animation}
            animate={{
              x: 0,
            }}
            exit={{
              x: 0,
            }}
            transition={{
              duration: 0.3,
              type: "spring",
            }}
          >
            {portionSize}
          </motion.span>
          <Button
            isIconOnly
            onPress={() => {
              setPortionSize((portionSize) => portionSize + 1);
              setAnimation({
                x: 30,
              });
            }}
            className="duration-300 hover:scale-110 hover:bg-primary"
          >
            <FaPlus />
          </Button>
        </CardFooter>
      )}
    </>
  );
}
