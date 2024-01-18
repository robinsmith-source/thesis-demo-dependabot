import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { equivalentUnits } from "~/utils/IngredientCalculator";
import type { Unit } from "@prisma/client";
import { TRPCError } from "@trpc/server";

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

  update: protectedProcedure
    .input(
      z.object({
        shoppingListId: z.string().cuid(),
        name: z.string(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const existingList = await ctx.db.shoppingList.findFirst({
        where: {
          id: input.shoppingListId,
          authorId: ctx.session.user.id,
        },
      });

      if (!existingList) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Shopping List not found.",
        });
      }

      return ctx.db.shoppingList.update({
        where: {
          id: input.shoppingListId,
        },
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),

  getAllTables: protectedProcedure.query(async ({ ctx }) => {
    const tables = await ctx.db.shoppingList.findMany({
      orderBy: { createdAt: "desc" },
      where: { authorId: ctx.session.user.id },
      include: {
        items: {
          include: { shoppingList: true },
        },
      },
    });

    if (!tables) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Tables not found.",
      });
    }

    return tables;
  }),

  getAllLists: protectedProcedure.query(async ({ ctx }) => {
    const lists = await ctx.db.shoppingList.findMany({
      orderBy: { createdAt: "desc" },
      where: { authorId: ctx.session.user.id },
      select: {
        id: true,
        name: true,
      },
    });

    if (!lists) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Lists not found.",
      });
    }

    return lists;
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
        const existingList = await tx.shoppingList.findFirst({
          where: {
            id: input.shoppingListId,
            authorId: ctx.session.user.id,
          },
        });

        if (!existingList) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Shopping List not found.",
          });
        }

        return Promise.all(
          input.ingredients.map(async (ingredient) => {
            const getEquivalentUnits = (): [Unit, Unit] | null =>
              equivalentUnits.find(
                ([u1, u2]) => u1 === ingredient.unit || u2 === ingredient.unit,
              ) ?? null;

            const shoppingListItem = await tx.shoppingListItem.upsert({
              where: {
                name_unit_shoppingListId: {
                  name: ingredient.name,
                  unit: getEquivalentUnits()?.[0] ?? ingredient.unit,
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

  delete: protectedProcedure
    .input(
      z.object({
        shoppingListId: z.string().cuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const existingList = await ctx.db.shoppingList.findFirst({
        where: {
          id: input.shoppingListId,
          authorId: ctx.session.user.id,
        },
      });

      if (!existingList) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Shopping List not found.",
        });
      }

      return ctx.db.shoppingList.delete({
        where: {
          id: input.shoppingListId,
        },
      });
    }),

  deleteItems: protectedProcedure
    .input(
      z.object({
        shoppingListId: z.string().cuid(),
        items: z.array(z.string().cuid()),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const existingList = await ctx.db.shoppingList.findUniqueOrThrow({
        where: {
          id: input.shoppingListId,
          authorId: ctx.session.user.id,
        },
      });

      if (!existingList) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Shopping List not found.",
        });
      }

      const items = await ctx.db.shoppingListItem.findMany({
        where: {
          id: {
            in: input.items,
          },
          shoppingListId: input.shoppingListId,
        },
      });

      if (!items) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Items not found.",
        });
      }

      return ctx.db.shoppingListItem.deleteMany({
        where: {
          id: {
            in: input.items,
          },
          shoppingListId: input.shoppingListId,
        },
      });
    }),
});
