"use client";
import ShoppingListSelector from "~/app/_components/ShoppingListSelector";
import IngredientTable from "~/app/recipe/[id]/IngredientTable";
import type { RecipeStepIngredient, ShoppingList } from "@prisma/client";
import { type Key, useState } from "react";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import type { Ingredient } from "~/utils/IngredientCalculator";
import { Button } from "@nextui-org/react";

interface ShoppingListHandlerProps {
  ingredients: RecipeStepIngredient[];
  shoppingLists: ShoppingList[];
}

export default function ShoppingListHandler({
  ingredients,
  shoppingLists,
}: ShoppingListHandlerProps) {
  const [shoppingListId, setShoppingListId] = useState<Key>();
  const [selectedIngredients, setSelectedIngredients] =
    useState<Ingredient[]>();

  function handleAddItem() {
    createMutation.mutate({
      shoppingListId: shoppingListId as string,
      ingredients: selectedIngredients
        ? selectedIngredients.map((ingredient) => ({
            ...ingredient,
          }))
        : [],
    });
  }

  const createMutation = api.shoppingList.addItems.useMutation({
    onSuccess: () => {
      toast.success("Ingredients added successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="flex max-w-xs flex-col gap-4">
      <ShoppingListSelector
        shoppingLists={shoppingLists}
        onChange={(listId) => setShoppingListId(listId)}
      />
      <Button
        onClick={handleAddItem}
        isDisabled={
          !shoppingListId ||
          !selectedIngredients ||
          selectedIngredients.length < 1
        }
      >
        Add items to shopping list
      </Button>
      <IngredientTable
        ingredients={ingredients}
        onSelect={(ingredients) => setSelectedIngredients(ingredients)}
      />
    </div>
  );
}
