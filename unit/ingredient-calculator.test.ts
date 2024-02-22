import { expect, test } from "vitest";
import { calculateIngredients } from "~/utils/IngredientCalculator";
import { Unit } from "@prisma/client";

test("calculates the ingredients for a portion size", () => {
  const ingredients = [
    { id: "1", name: "flour", quantity: 100, unit: Unit.GRAM },
    { id: "2", name: "water", quantity: 100, unit: Unit.MILLILITER },
  ];

  const result = calculateIngredients(ingredients, 2);

  expect(result).toEqual([
    { id: "1", name: "flour", quantity: 200, unit: Unit.GRAM },
    { id: "2", name: "water", quantity: 200, unit: Unit.MILLILITER },
  ]);
});

test("calculates the ingredients for a portion size with different units", () => {
  const ingredients = [
    { id: "1", name: "flour", quantity: 100, unit: Unit.GRAM },
    { id: "2", name: "water", quantity: 100, unit: Unit.MILLILITER },
  ];

  const result = calculateIngredients(ingredients, 3);

  expect(result).toEqual([
    { id: "1", name: "flour", quantity: 300, unit: Unit.GRAM },
    { id: "2", name: "water", quantity: 300, unit: Unit.MILLILITER },
  ]);
});

test("calculates the ingredients for a portion size with different units and converts to larger unit", () => {
  const ingredients = [
    { id: "1", name: "flour", quantity: 1000, unit: Unit.GRAM },
    { id: "2", name: "water", quantity: 1000, unit: Unit.MILLILITER },
  ];

  const result = calculateIngredients(ingredients, 2);

  expect(result).toEqual([
    { id: "1", name: "flour", quantity: 2, unit: Unit.KILOGRAM },
    { id: "2", name: "water", quantity: 2, unit: Unit.LITER },
  ]);
});

test("calculates the ingredients for a portion size with different units and converts to larger unit", () => {
  const ingredients = [
    { id: "1", name: "flour", quantity: 1000, unit: Unit.GRAM },
    { id: "2", name: "water", quantity: 1000, unit: Unit.MILLILITER },
  ];

  const result = calculateIngredients(ingredients, 3);

  expect(result).toEqual([
    { id: "1", name: "flour", quantity: 3, unit: Unit.KILOGRAM },
    { id: "2", name: "water", quantity: 3, unit: Unit.LITER },
  ]);
});

test("calculates the ingredients for a portion size with different units and converts to larger unit", () => {
  const ingredients = [
    { id: "1", name: "flour", quantity: 1000, unit: Unit.GRAM },
    { id: "2", name: "water", quantity: 1000, unit: Unit.MILLILITER },
  ];

  const result = calculateIngredients(ingredients, 4);

  expect(result).toEqual([
    { id: "1", name: "flour", quantity: 4, unit: Unit.KILOGRAM },
    { id: "2", name: "water", quantity: 4, unit: Unit.LITER },
  ]);
});

test("calculates the ingredients for a portion size with different units and converts to larger unit, jumping over 1000", () => {
  const ingredients = [
    { id: "1", name: "flour", quantity: 500, unit: Unit.GRAM },
    { id: "2", name: "water", quantity: 500, unit: Unit.MILLILITER },
  ];

  const result = calculateIngredients(ingredients, 5);

  expect(result).toEqual([
    { id: "1", name: "flour", quantity: 2.5, unit: Unit.KILOGRAM },
    { id: "2", name: "water", quantity: 2.5, unit: Unit.LITER },
  ]);
});

test("calculates the ingredients for a portion size with different units and converts to larger unit, jumping over 1000", () => {
  const ingredients = [
    { id: "1", name: "flour", quantity: 500, unit: Unit.GRAM },
    { id: "2", name: "water", quantity: 500, unit: Unit.MILLILITER },
  ];

  const result = calculateIngredients(ingredients, 6);

  expect(result).toEqual([
    { id: "1", name: "flour", quantity: 3, unit: Unit.KILOGRAM },
    { id: "2", name: "water", quantity: 3, unit: Unit.LITER },
  ]);
});

test("calculates the ingredients for a portion size with different units and converts to larger unit, jumping over 1000", () => {
  const ingredients = [
    { id: "1", name: "flour", quantity: 750, unit: Unit.GRAM },
    { id: "2", name: "water", quantity: 750, unit: Unit.MILLILITER },
  ];

  const result = calculateIngredients(ingredients, 3);

  expect(result).toEqual([
    { id: "1", name: "flour", quantity: 2.25, unit: Unit.KILOGRAM },
    { id: "2", name: "water", quantity: 2.25, unit: Unit.LITER },
  ]);
});

test("calculates the ingredients for a portion size with zero quantity", () => {
  const ingredients = [
    { id: "1", name: "flour", quantity: 0, unit: Unit.GRAM },
    { id: "2", name: "water", quantity: 0, unit: Unit.MILLILITER },
  ];

  const result = calculateIngredients(ingredients, 2);

  expect(result).toEqual([
    { id: "1", name: "flour", quantity: 0, unit: Unit.GRAM },
    { id: "2", name: "water", quantity: 0, unit: Unit.MILLILITER },
  ]);
});

test("calculates the ingredients for a portion size with different units and converts to larger unit, jumping over 1000", () => {
  const ingredients = [
    { id: "1", name: "flour", quantity: 600, unit: Unit.GRAM },
    { id: "2", name: "water", quantity: 600, unit: Unit.MILLILITER },
  ];

  const result = calculateIngredients(ingredients, 4);

  expect(result).toEqual([
    { id: "1", name: "flour", quantity: 2.4, unit: Unit.KILOGRAM },
    { id: "2", name: "water", quantity: 2.4, unit: Unit.LITER },
  ]);
});

test("calculates the ingredients for a portion size with different units and converts to larger unit, jumping over 1000", () => {
  const ingredients = [
    { id: "1", name: "flour", quantity: 800, unit: Unit.GRAM },
    { id: "2", name: "water", quantity: 800, unit: Unit.MILLILITER },
  ];

  const result = calculateIngredients(ingredients, 3);

  expect(result).toEqual([
    { id: "1", name: "flour", quantity: 2.4, unit: Unit.KILOGRAM },
    { id: "2", name: "water", quantity: 2.4, unit: Unit.LITER },
  ]);
});

test("calculates the ingredients for portion size 0", () => {
  const ingredients = [
    { id: "1", name: "flour", quantity: 500, unit: Unit.GRAM },
    { id: "2", name: "water", quantity: 500, unit: Unit.MILLILITER },
  ];

  const result = calculateIngredients(ingredients, 0);

  expect(result).toEqual([
    { id: "1", name: "flour", quantity: 0, unit: Unit.GRAM },
    { id: "2", name: "water", quantity: 0, unit: Unit.MILLILITER },
  ]);
});

test("calculates the ingredients for a portion size with larger units", () => {
  const ingredients = [
    { id: "1", name: "flour", quantity: 1, unit: Unit.KILOGRAM },
    { id: "2", name: "water", quantity: 1, unit: Unit.LITER },
  ];

  const result = calculateIngredients(ingredients, 2);

  expect(result).toEqual([
    { id: "1", name: "flour", quantity: 2, unit: Unit.KILOGRAM },
    { id: "2", name: "water", quantity: 2, unit: Unit.LITER },
  ]);
});
