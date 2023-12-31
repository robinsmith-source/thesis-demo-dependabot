"use client";
import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useState } from "react";
import { Prisma } from "@prisma/client";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { convertUnitName } from "~/app/utils";
import { calculateIngredients } from "~/utils/IngredientCalculator";

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
  const [selectedKeys, setSelectedKeys] = useState(new Set<string>());

  const [portionSize, setPortionSize] = useState<number>(1);
  const ingredients = recipeSteps.flatMap((step) => step.ingredients);
  const summarizedIngredients = calculateIngredients(ingredients, portionSize);

  //TODO: add shopping list selector
  function handleAddItem() {
    createMutation.mutate({
      shoppingListId: "clqsrvv0u0004x34jx0i0xmk9",
      ingredients: selectedIngredients.map((ingredient) => ({
        ...ingredient,
      })),
    });
  }

  const selectedIngredients = summarizedIngredients.filter((_, index) =>
    selectedKeys.has(index.toString()),
  );

  const createMutation = api.shoppingList.addItems.useMutation({
    onSuccess: () => {
      toast.success("Ingredients added successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  //TODO: fix ESLint error
  return (
    <>
      <Table
        aria-label="Ingredient Table"
        className={`max-w-xs py-4 ${className}`}
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
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
      <Button color="success" onClick={handleAddItem}>
        Add Ingredients
      </Button>
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
