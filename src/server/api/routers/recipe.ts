import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { utapi } from "~/server/uploadthing";
import { calculateAverage } from "~/utils/RatingCalculator";

export const recipeRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ input, ctx }) => {
      const recipe = await ctx.db.recipe.findFirst({
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
          savedUsers: {
            where: {
              id: ctx?.session?.user?.id,
            },
          },
          _count: {
            select: {
              savedUsers: true,
            },
          },
        },
      });

      if (!recipe) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Recipe not found.",
        });
      }

      return recipe;
    }),

  getCards: publicProcedure
    .input(
      z.object({
        take: z.number().min(1).max(50),
        skip: z.number().min(0).optional(),
        name: z.string().optional(),
        difficulty: z.enum(["EASY", "MEDIUM", "HARD", "EXPERT"]).optional(),
        tags: z.array(z.string()).optional(),
        labels: z.array(z.string()).optional(),
        authorId: z.string().cuid().optional(),
        orderBy: z.enum(["NEWEST", "OLDEST", "RATING"]).optional(),
        excludeRecipeId: z.string().cuid().optional(),
        isFollowingFeed: z.boolean().optional(),
        savedFeedUserId: z.string().cuid().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      function createLabelQuery(labels: string[]) {
        return {
          AND: labels.map((label) => ({
            labels: {
              some: {
                name: label,
              },
            },
          })),
        };
      }

      const recipes = await ctx.db.recipe.findMany({
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
        where: {
          ...(input.name && {
            name: { contains: input.name, mode: "insensitive" },
          }),
          ...(input.difficulty && { difficulty: input.difficulty }),
          ...(input.tags && { tags: { hasEvery: input.tags } }),
          ...(input.labels && createLabelQuery(input.labels)),
          ...(input.authorId && { authorId: input.authorId }),
          ...(input.excludeRecipeId && { id: { not: input.excludeRecipeId } }),
          ...(input.isFollowingFeed && {
            author: { followedBy: { some: { id: ctx?.session?.user?.id } } },
          }),
          ...(input.savedFeedUserId && {
            savedUsers: { some: { id: input.savedFeedUserId } },
          }),
        },
        skip: input.skip ?? 0,
        take: input.take,
        select: {
          id: true,
          name: true,
          difficulty: true,
          labels: { select: { name: true } },
          images: true,
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      });

      if (input.orderBy === "RATING") {
        return recipes.sort(
          (a, b) =>
            calculateAverage(b.reviews).averageRating -
            calculateAverage(a.reviews).averageRating,
        );
      }

      return recipes;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3).max(50),
        description: z.string().min(3).max(300).nullable(),
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
            description: z.string().min(3).max(300),
            duration: z.number().min(1),
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
                name: z.string().min(1).max(50),
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
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.$transaction(async (tx) => {
        const recipe = await tx.recipe.create({
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
            return tx.recipeStep.create({
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
      });
    }),

  deleteRecipeImage: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingRecipe = await ctx.db.recipe.findFirst({
        where: { images: { has: input.key } },
      });

      if (!existingRecipe) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Recipe with the specified image key not found.",
        });
      }

      if (existingRecipe.authorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can't delete images used by another user's recipe.",
        });
      }

      await utapi.deleteFiles(input.key);

      // If the image was associated with a recipe, remove the link from the recipe
      await ctx.db.recipe.update({
        where: { id: existingRecipe.id },
        data: {
          images: {
            set: existingRecipe.images.filter((img) => img !== input.key),
          },
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string().min(3).max(50),
        description: z.string().min(3).max(300).nullable(),
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
            description: z.string().min(3).max(300),
            duration: z.number().min(1),
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
                name: z.string().min(1).max(50),
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
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const recipe = await ctx.db.recipe.findFirst({
        where: { id: input.id },
      });

      if (!recipe) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Recipe not found.",
        });
      }

      if (recipe.authorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only edit your own recipes.",
        });
      }

      return await ctx.db.$transaction(async (tx) => {
        await tx.recipe.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            description: input.description,
            difficulty: input.difficulty,
            tags: input.tags,
            images: input.images,
            author: { connect: { id: ctx.session.user.id } },
          },
        });

        await tx.recipeStep.deleteMany({
          where: {
            recipeId: input.id,
          },
        });

        await Promise.all(
          input.steps.map((step) => {
            return tx.recipeStep.create({
              data: {
                recipe: { connect: { id: input.id } },
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

        return input.id;
      });
    }),

  delete: protectedProcedure
    .input(z.object({ recipeId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const recipe = await ctx.db.recipe.findFirst({
        where: { id: input.recipeId, authorId: ctx.session.user.id },
      });

      if (!recipe) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Recipe not found.",
        });
      }

      await ctx.db.$transaction(async (tx) => {
        await tx.recipe.delete({
          where: {
            id: input.recipeId,
            authorId: ctx.session.user.id,
          },
        });

        if (recipe.images.length > 0) {
          await utapi.deleteFiles(recipe.images);
        }
      });
    }),

  save: protectedProcedure
    .input(z.object({ recipeId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const recipe = await ctx.db.recipe.findFirst({
        where: { id: input.recipeId },
        include: {
          savedUsers: {
            where: { id: ctx.session.user.id },
          },
        },
      });

      if (!recipe) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Recipe not found.",
        });
      }

      if (recipe.savedUsers.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Recipe is already saved.",
        });
      }

      await ctx.db.recipe.update({
        where: { id: input.recipeId },
        data: {
          savedUsers: {
            connect: { id: ctx.session.user.id },
          },
        },
      });
    }),

  unsave: protectedProcedure
    .input(z.object({ recipeId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const recipe = await ctx.db.recipe.findFirst({
        where: { id: input.recipeId },
        include: {
          savedUsers: {
            where: { id: ctx.session.user.id },
          },
        },
      });

      if (!recipe) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Recipe not found.",
        });
      }

      if (recipe.savedUsers.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Recipe is not saved.",
        });
      }

      await ctx.db.recipe.update({
        where: { id: input.recipeId },
        data: {
          savedUsers: {
            disconnect: { id: ctx.session.user.id },
          },
        },
      });
    }),
});
