import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const reviewRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
        recipeId: z.string().cuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const existingReview = await ctx.db.recipeReview.findFirst({
        where: {
          recipeId: input.recipeId,
          authorId: ctx.session.user.id,
        },
      });

      if (existingReview) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already reviewed this recipe",
        });
      }

      const ownRecipe = await ctx.db.recipe.findFirst({
        where: {
          id: input.recipeId,
          authorId: ctx.session.user.id,
        },
      });

      if (ownRecipe) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot review your own recipe",
        });
      }

      return ctx.db.recipeReview.create({
        data: {
          rating: input.rating,
          comment: input.comment,
          recipe: { connect: { id: input.recipeId } },
          author: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getMyReview: protectedProcedure
    .input(
      z.object({
        recipeId: z.string().cuid(),
      }),
    )
    .query(({ input, ctx }) => {
      return ctx.db.recipeReview.findFirst({
        where: {
          recipeId: input.recipeId,
          authorId: ctx.session.user.id,
        },
        select: {
          id: true,
          rating: true,
          comment: true,
        },
      });
    }),

  getOthers: publicProcedure
    .input(
      z.object({
        recipeId: z.string().cuid(),
      }),
    )
    .query(({ input, ctx }) => {
      return ctx.db.recipeReview.findMany({
        where: {
          recipeId: input.recipeId,
          authorId: { not: ctx?.session?.user?.id },
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        reviewId: z.string().cuid(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const existingReview = await ctx.db.recipeReview.findFirst({
        where: {
          id: input.reviewId,
          authorId: ctx.session.user.id,
        },
      });

      if (!existingReview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }

      return ctx.db.recipeReview.update({
        where: {
          id: existingReview.id,
        },
        data: {
          rating: input.rating,
          comment: input.comment,
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        reviewId: z.string().cuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const existingReview = await ctx.db.recipeReview.findFirst({
        where: {
          id: input.reviewId,
          authorId: ctx.session.user.id,
        },
      });

      if (!existingReview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }

      return ctx.db.recipeReview.delete({
        where: {
          id: existingReview.id,
          authorId: ctx.session.user.id,
        },
      });
    }),
});
