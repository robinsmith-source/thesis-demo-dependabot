"use client";
import ShoppingListSelector from "~/app/_components/ShoppingListSelector";
import IngredientTable from "~/app/recipe/[id]/IngredientTable";
import { RecipeStepIngredient, ShoppingList } from "@prisma/client";
import { Key, useState } from "react";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { Ingredient } from "~/utils/IngredientCalculator";
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

  console.log("ingredients: ", selectedIngredients, "list: ", shoppingListId);

  return (
    <div>
      <ShoppingListSelector
        shoppingLists={shoppingLists}
        onChange={(listId) => setShoppingListId(listId)}
      />
      <IngredientTable
        ingredients={ingredients}
        onSelect={(ingredients) => setSelectedIngredients(ingredients)}
      />
      <Button onClick={handleAddItem}>Add to shopping list</Button>
    </div>
  );
}
