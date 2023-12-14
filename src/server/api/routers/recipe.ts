import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { utapi } from "~/server/uploadthing";

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

  getLatestRecipes: publicProcedure
    .input(z.object({ take: z.number().min(1).max(50) }))
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

  getRecipesAdvanced: publicProcedure
    .input(
      z.object({
        take: z.number().min(1).max(50),
        skip: z.number().min(0).optional(),
        name: z.string().optional(),
        difficulty: z.enum(["EASY", "MEDIUM", "HARD", "EXPERT"]).optional(),
        labels: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
        authorId: z.string().cuid().optional(),
        orderBy: z.enum(["NEWEST", "OLDEST"]).optional(),
        groupBy: z.enum(["NONE", "LABELS"]).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const query = {};

      if (input.name) {
        query.name = { contains: input.name };
      }

      if (input.difficulty) {
        query.difficulty = input.difficulty;
      }

      if (input.tags) {
        query.tags = { hasEvery: input.tags };
      }

      if (input.authorId) {
        query.authorId = { contains: input.authorId };
      }

      if (input.labels) {
        query.labels = { some: { name: { in: input.labels } } };
      }

      const recipes = await ctx.db.recipe.findMany({
        // TODO: currently we don't use take because the manual non-db filtering messes with it
        // this is bad :(
        skip: input.skip ?? 0,
        orderBy: (() => {
          switch (input.orderBy) {
            case "NEWEST":
              return { createdAt: "desc" };
            case "OLDEST":
              return { createdAt: "asc" };
            default:
              return { createdAt: "desc" };
          }
        })(),
        where: query,
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

      if (input.labels) {
        return recipes
          .filter(
            (recipe) =>
              input.labels?.every((inputLabel) =>
                recipe.labels.some(
                  (recipeLabel) => recipeLabel.name === inputLabel,
                ),
              ),
          )
          .slice(0, input.take);
      } else {
        return recipes.slice(0, input.take);
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().nullable(),
        difficulty: z.enum(["EASY", "MEDIUM", "HARD", "EXPERT"]),
        images: z.array(z.string()),
        tags: z
          .array(
            z
              .string({ invalid_type_error: "Tags must be strings" })
              .min(1)
              .regex(/^[a-z]+$/, "Tags can only contain lowercase characters"),
          )
          .max(10, "A recipe can only have 10 tags")
          .refine((items) => new Set(items).size === items.length, {
            message: "Must be an array of unique strings",
          }),
        steps: z.array(
          z.object({
            description: z.string(),
            duration: z.number().min(0),
            stepType: z.enum([
              "PREP",
              "COOK",
              "REST",
              "SEASON",
              "SERVE",
              "MIX",
            ]),
            ingredients: z.array(
              z.object({
                name: z.string().min(1),
                quantity: z.number().min(1),
                unit: z
                  .enum([
                    "GRAM",
                    "KILOGRAM",
                    "LITER",
                    "MILLILITER",
                    "TEASPOON",
                    "TABLESPOON",
                    "CUP",
                    "PINCH",
                    "PIECE",
                  ])
                  .nullable(),
              }),
            ),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const recipe = await ctx.db.recipe.create({
        data: {
          name: input.name,
          description: input.description,
          difficulty: input.difficulty,
          tags: input.tags,
          images: input.images,
          author: { connect: { id: ctx.session.user.id } },
        },
      });

      await Promise.all(
        input.steps.map((step) => {
          return ctx.db.recipeStep.create({
            data: {
              recipe: { connect: { id: recipe.id } },
              description: step.description,
              duration: step.duration,
              stepType: step.stepType,
              ingredients: {
                createMany: {
                  data: step.ingredients?.map((ingredient) => ({
                    name: ingredient.name,
                    quantity: ingredient.quantity,
                    unit: ingredient.unit,
                  })),
                },
              },
            },
          });
        }),
      );

      return recipe.id;
    }),

  deleteRecipeImage: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // later this should check for existing recipes, make sure the user matches and then remove the link and then delete it
      // for now just check it doesn't exist and then delete it
      const existingRecipe = await ctx.db.recipe.findFirst({
        where: { images: { has: input.key } },
      });
      // make sure there is no recipe with this image
      if (existingRecipe) throw new Error("Image is used by a recipe");

      await utapi.deleteFiles(input.key);
    }),

  updateRecipe: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string().min(1),
        description: z.string().optional(),
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
                unit: z
                  .enum([
                    "GRAM",
                    "KILOGRAM",
                    "LITER",
                    "MILLILITER",
                    "TEASPOON",
                    "TABLESPOON",
                    "CUP",
                    "PINCH",
                    "PIECE",
                  ])
                  .nullable(),
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
