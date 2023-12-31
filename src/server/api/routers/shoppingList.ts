import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { equivalentUnits } from "~/utils/IngredientCalculator";
import { Unit } from "@prisma/client";

export const shoppingListRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.db.shoppingList.create({
        data: {
          name: input.name,
          description: input.description,
          author: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  get: publicProcedure
    .input(z.object({ shoppingListId: z.string().cuid() }))
    .query(({ input, ctx }) => {
      return ctx.db.shoppingList.findFirst({
        where: { id: input.shoppingListId },
        include: {
          items: true,
        },
      });
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.shoppingList.findMany({
      orderBy: { createdAt: "desc" },
      where: { authorId: ctx.session.user.id },
    });
  }),

  addItems: protectedProcedure
    .input(
      z.object({
        shoppingListId: z.string().cuid(),
        ingredients: z.array(
          z.object({
            name: z.string().min(1),
            quantity: z.number().min(1),
            unit: z.enum([
              "GRAM",
              "KILOGRAM",
              "LITER",
              "MILLILITER",
              "TEASPOON",
              "TABLESPOON",
              "CUP",
              "PINCH",
              "PIECE",
            ]),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.db.$transaction(async (tx) => {
        await Promise.all(
          input.ingredients.map(async (ingredient) => {
            const getEquivalentUnits = (): [Unit, Unit] | null =>
              equivalentUnits.find(
                ([u1, u2]) => u1 === ingredient.unit || u2 === ingredient.unit,
              ) || null;

            const shoppingListItem = await tx.shoppingListItem.upsert({
              where: {
                name_unit_shoppingListId: {
                  name: ingredient.name,
                  unit: getEquivalentUnits()?.[0] || ingredient.unit,
                  shoppingListId: input.shoppingListId,
                },
              },
              create: {
                shoppingList: { connect: { id: input.shoppingListId } },
                ...ingredient,
              },
              update: {
                quantity: {
                  increment:
                    getEquivalentUnits() &&
                    getEquivalentUnits()?.[1] === ingredient.unit
                      ? ingredient.quantity * 1000
                      : ingredient.quantity,
                },
              },
            });
            return shoppingListItem.id;
          }),
        );
      });
    }),
});
