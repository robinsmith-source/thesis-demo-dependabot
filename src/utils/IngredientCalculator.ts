import type { Unit } from "@prisma/client";

export type Ingredient = {
  id: string;
  name: string;
  quantity: number;
  unit: Unit;
};

export const equivalentUnits: [Unit, Unit][] = [
  ["GRAM", "KILOGRAM"],
  ["MILLILITER", "LITER"],
];

export function calculateIngredients(
  ingredients: Ingredient[],
  portionSize: number,
) {
  const result: Ingredient[] = [];

  ingredients.forEach((ingredient) => {
    const existingIngredient = result.find(
      (item) =>
        item.name.toUpperCase() === ingredient.name.toUpperCase() &&
        equivalentUnits.some(
          ([u1, u2]) => (u1 === u1 && u2 === u2) || (u1 === u2 && u2 === u1),
        ),
    );

    if (existingIngredient) {
      existingIngredient.quantity += ingredient.quantity * portionSize;
    } else {
      result.push({
        ...ingredient,
        quantity: ingredient.quantity * portionSize,
      } as Ingredient);
    }
  });

  result.forEach((ingredient) => {
    const converted = convertUnit(ingredient.unit, ingredient.quantity);
    ingredient.quantity = converted.quantity;
    ingredient.unit = converted.unit!;
  });

  function convertUnit(unit: Unit | null, quantity: number) {
    if (unit === "GRAM" && quantity >= 1000) {
      return {
        quantity: quantity / 1000,
        unit: "KILOGRAM" as Unit,
      };
    } else if (unit === "MILLILITER" && quantity >= 1000) {
      return {
        quantity: quantity / 1000,
        unit: "LITER" as Unit,
      };
    } else {
      return {
        quantity,
        unit,
      };
    }
  }

  return result;
}
