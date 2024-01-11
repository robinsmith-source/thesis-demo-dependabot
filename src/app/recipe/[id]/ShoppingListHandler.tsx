"use client";
import ShoppingListSelector from "~/app/_components/ShoppingListSelector";
import IngredientTable from "~/app/_components/IngredientTable";
import type { RecipeStepIngredient } from "@prisma/client";
import { type Key, useCallback, useState } from "react";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import type { Ingredient } from "~/utils/IngredientCalculator";
import { Button, CardBody } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Card, CardHeader } from "@nextui-org/card";

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
  const router = useRouter();
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
      toast.success(
        `${
          selectedIngredients && selectedIngredients?.length === 1
            ? "Ingredient"
            : "Ingredients"
        } added successfully`,
      );
      router.push("/shopping-list");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSelect = useCallback((selectedIngredients: Ingredient[]) => {
    setSelectedIngredients(selectedIngredients);
  }, []);

  return (
    <Card className="flex max-w-xs flex-col">
      <CardHeader className="flex flex-col gap-4">
        {isAuthorized && (
          <>
            <ShoppingListSelector
              shoppingLists={shoppingLists}
              onChange={(listId) => setShoppingListId(listId)}
            />
            <Button
              onClick={handleAddItem}
              className="w-full"
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
      </CardHeader>
      <CardBody>
        <IngredientTable
          isSelectable={isAuthorized}
          isPortionable
          removeWrapper
          ingredients={ingredients}
          onSelect={onSelect}
        />
      </CardBody>
    </Card>
  );
}
