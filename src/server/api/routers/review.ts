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
        comment: z.string().nullable(),
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

      return ctx.db.recipeReview.create({
        data: {
          rating: input.rating,
          comment: input.comment,
          recipe: { connect: { id: input.recipeId } },
          author: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getFirstReview: publicProcedure
    .input(
      z.object({
        recipeId: z.string().cuid(),
      }),
    )
    .query(({ input, ctx }) => {
      return ctx.db.recipeReview.findMany({
        where: { recipeId: input.recipeId, authorId: ctx.session?.user.id },
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

  getOtherReviews: publicProcedure
    .input(
      z.object({
        recipeId: z.string().cuid(),
      }),
    )
    .query(({ input, ctx }) => {
      return ctx.db.recipeReview.findMany({
        where: {
          recipeId: input.recipeId,
          authorId: { not: ctx.session?.user.id },
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

  delete: protectedProcedure
    .input(
      z.object({
        reviewId: z.string().cuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.recipeReview.delete({
        where: {
          id: input.reviewId,
          authorId: ctx.session.user.id,
        },
      });
    }),
});
