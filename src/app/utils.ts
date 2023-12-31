import type { Unit } from "@prisma/client";

const unitConversion = {
  GRAM: "g",
  KILOGRAM: "kg",
  LITER: "l",
  MILLILITER: "ml",
  TEASPOON: "tsp",
  TABLESPOON: "tbsp",
  CUP: "cups",
  PINCH: "pinch",
  PIECE: "",
};

export function convertUnitName(unit: Unit): string {
  return unitConversion?.[unit] ?? "";
}
