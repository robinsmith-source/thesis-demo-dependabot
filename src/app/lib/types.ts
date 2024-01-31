import type {
  Recipe,
  RecipeStep,
  RecipeStepIngredient,
  ShoppingList,
  ShoppingListItem,
} from "@prisma/client";

export enum ShoppingListModes {
  CREATE,
  EDIT,
  DELETE,
}

export type ShoppingListTableProps = {
  shoppingList: ShoppingList & {
    items: ShoppingListItem[];
  };
};

export type RecipeFormValues = Recipe & {
  steps: (RecipeStep & {
    ingredients: RecipeStepIngredient[];
  })[];
};

export type Ingredient = Omit<RecipeStepIngredient, "recipeStepId">;
