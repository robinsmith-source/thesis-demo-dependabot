import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const recipeRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(({ input, ctx }) => {
      return ctx.db.recipe.findFirst({
        where: { id: input.id },
        include: {
          steps: {
            include: {
              ingredients: true,
            },
          },
          reviews: {
            include: {
              author: true,
            },
          },
          labels: true,
          author: true,
        },
      });
    }),

  getRecipePreview: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(({ input, ctx }) => {
      return ctx.db.recipe.findFirst({
        where: { id: input.id },
        include: {
          labels: true,
          author: true,
        },
      });
    }),

  getFeaturedRecipes: publicProcedure
    .input(z.object({ take: z.number().min(1).max(10) }))
    .query(({ ctx, input }) => {
      return ctx.db.recipe.findMany({
        orderBy: { createdAt: "desc" },
        where: {},
        take: input.take,
        select: {
          id: true,
        },
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.recipe.findMany({
      orderBy: { createdAt: "desc" },
      where: {},
      include: {
        steps: {
          include: {
            ingredients: true,
          },
        },
        reviews: {
          include: {
            author: true,
          },
        },
        labels: true,
      },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        requiredUtensils: z.array(z.string()),
        difficulty: z.enum(["EASY", "MEDIUM", "HARD", "EXPERT"]),
        steps: z.array(
          z.object({
            description: z.string(),
            duration: z.number().min(0),
            stepType: z.enum(["PREP", "COOK", "REST"]),
            ingredients: z.array(
              z.object({
                name: z.string().min(1),
                quantity: z.number().min(1),
                unit: z.string().optional(),
              }),
            ),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.recipe.create({
        data: {
          name: input.name,
          description: input.name,
          requiredUtensils: { set: input.requiredUtensils },
          difficulty: input.difficulty,
          steps: {
            createMany: {
              data: input.steps.map((step) => ({
                description: step.description,
                duration: step.duration,
                stepType: step.stepType,
                ingredients: {
                  createMany: {
                    data: step.ingredients.map((ingredient) => ({
                      name: ingredient.name,
                      quantity: ingredient.quantity,
                      unit: ingredient.unit,
                    })),
                  },
                },
              })),
            },
          },
          author: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  updateRecipe: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string().min(1),
        description: z.string().optional(),
        requiredUtensils: z.array(z.string()),
        difficulty: z.enum(["EASY", "MEDIUM", "HARD", "EXPERT"]),
        steps: z.array(
          z.object({
            description: z.string(),
            duration: z.number().min(0),
            stepType: z.enum(["PREP", "COOK", "REST"]),
            ingredients: z.array(
              z.object({
                name: z.string().min(1),
                quantity: z.number().min(1),
                unit: z.string().optional(),
              }),
            ),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.recipe.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          requiredUtensils: { set: input.requiredUtensils },
          difficulty: input.difficulty,
          steps: {
            updateMany: {
              where: {},
              data: input.steps.map((step) => ({
                description: step.description,
                duration: step.duration,
                stepType: step.stepType,
                ingredients: {
                  updateMany: {
                    where: {},
                    data: step.ingredients.map((ingredient) => ({
                      name: ingredient.name,
                      quantity: ingredient.quantity,
                      unit: ingredient.unit,
                    })),
                  },
                },
              })),
            },
          },
        },
      });
    }),

  updateRecipeStep: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        stepId: z.string().cuid(),
        description: z.string(),
        duration: z.number().min(0),
        stepType: z.enum(["PREP", "COOK", "REST"]),
        ingredients: z.array(
          z.object({
            name: z.string().min(1),
            quantity: z.number().min(1),
            unit: z.string().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.recipe.update({
        where: {
          id: input.id,
        },
        data: {
          steps: {
            update: {
              where: {
                id: input.id,
              },
              data: {
                description: input.description,
                duration: input.duration,
                stepType: input.stepType,
                ingredients: {
                  updateMany: {
                    where: {},
                    data: input.ingredients.map((ingredient) => ({
                      name: ingredient.name,
                      quantity: ingredient.quantity,
                      unit: ingredient.unit,
                    })),
                  },
                },
              },
            },
          },
        },
      });
    }),

  deleteRecipe: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.recipe.delete({
        where: { id: input.id },
      });
    }),
});
