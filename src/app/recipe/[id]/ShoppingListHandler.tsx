"use client";
import ShoppingListSelector from "~/app/_components/ShoppingListSelector";
import IngredientTable from "~/app/_components/IngredientTable";
import type { RecipeStepIngredient } from "@prisma/client";
import { type Key, useCallback, useState } from "react";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import type { Ingredient } from "~/utils/IngredientCalculator";
import { Button } from "@nextui-org/react";

interface ShoppingListHandlerProps {
  isAuthorized?: boolean;
  ingredients: RecipeStepIngredient[];
  shoppingLists: {
    id: string;
    name: string;
  }[];
}

export default function ShoppingListHandler({
  isAuthorized = false,
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

  //TODO: Should be removed when merging
  console.log(selectedIngredients);
  console.log(shoppingListId);
  const createMutation = api.shoppingList.addItems.useMutation({
    onSuccess: () => {
      toast.success(
        `${
          selectedIngredients && selectedIngredients?.length === 1
            ? "Ingredient"
            : "Ingredients"
        } added successfully`,
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  //TODO: fix build warning "React Hook useCallback has a missing dependency: 'selectedIngredients'.Either include it or remove the dependency array If 'onSelect' changes too often, find the parent component that defines it and wrap that definition in useCallback. "
  const onSelect = useCallback((selectedIngredients: Ingredient[]) => {
    setSelectedIngredients(selectedIngredients);
  }, []);

  return (
    <div className="flex max-w-xs flex-col gap-4">
      {isAuthorized && (
        <>
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
            {!selectedIngredients || selectedIngredients.length < 1
              ? "Select ingredients"
              : !shoppingListId
                ? "Select shopping list"
                : `Add ${
                    selectedIngredients?.length <= 1
                      ? "Ingredient"
                      : "Ingredients"
                  } to shopping list`}
          </Button>
        </>
      )}
      <IngredientTable
        isSelectable={isAuthorized}
        isPortionable
        ingredients={ingredients}
        onSelect={onSelect}
      />
    </div>
  );
}
