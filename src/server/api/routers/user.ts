import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.user.findFirst({
        where: { id: input.id },
        include: { recipes: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return user;
    }),

  getMetadata: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ input, ctx }) => {
      const loggedInUserId = ctx?.session?.user?.id;

      if (ctx?.session?.user?.id && input.id !== loggedInUserId) {
        const [isFollowing, metadata] = await ctx.db.$transaction([
          ctx.db.user.findFirst({
            where: {
              id: loggedInUserId,
              following: { some: { id: input.id } },
            },
          }),
          ctx.db.user.findFirst({
            where: { id: input.id },
            select: {
              _count: {
                select: { recipes: true, following: true, followedBy: true },
              },
            },
          }),
        ]);

        if (!metadata) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        return {
          following: isFollowing !== null,
          recipeCount: metadata._count.recipes,
          followingCount: metadata._count.following,
          followedByCount: metadata._count.followedBy,
        };
      } else {
        const metadata = await ctx.db.user.findFirst({
          where: { id: input.id },
          select: {
            _count: {
              select: { recipes: true, following: true, followedBy: true },
            },
          },
        });

        if (!metadata) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        return {
          following: null,
          recipeCount: metadata._count.recipes,
          followingCount: metadata._count.following,
          followedByCount: metadata._count.followedBy,
        };
      }
    }),

  getCards: publicProcedure
    .input(
      z.object({
        take: z.number().min(1).max(50),
        skip: z.number().min(0).optional(),
        name: z.string().optional(),
        orderBy: z.enum(["POPULARITY", "ALPHABETIC"]).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const users = await ctx.db.user.findMany({
        orderBy: (() => {
          switch (input.orderBy) {
            case "POPULARITY":
              return { followedBy: { _count: "desc" } };
            case "ALPHABETIC":
              return { name: "asc" };
          }
        })(),
        where: { name: { contains: input.name, mode: "insensitive" },
        },
        take: input.take,
        skip: input.skip ?? 0,
      });
      return users;
    }),

  getCardCount: publicProcedure
    .input(
      z.object({
        take: z.number().min(1).max(50),
        skip: z.number().min(0).optional(),
        name: z.string().optional(),
        orderBy: z.enum(["POPULARITY", "ALPHABETIC"]).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.user.count({
        orderBy: (() => {
          switch (input.orderBy) {
            case "POPULARITY":
              return { followedBy: { _count: "desc" } };
            case "ALPHABETIC":
              return { name: "asc" };
          }
        })(),
        where: { name: { contains: input.name, mode: "insensitive" } },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.recipe.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (!users) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Users not found.",
      });
    }

    return users;
  }),

  getFollowers: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ input, ctx }) => {
      const followers = await ctx.db.user.findMany({
        where: { following: { some: { id: input.id } } },
      });

      if (!followers) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Followers not found.",
        });
      }

      return followers;
    }),

  getFollowing: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ input, ctx }) => {
      const following = await ctx.db.user.findMany({
        where: { followedBy: { some: { id: input.id } } },
      });

      if (!following) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Following not found.",
        });
      }

      return following;
    }),

  follow: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(({ input, ctx }) => {
      const loggedInUserId = ctx.session.user.id;

      if (input.id === loggedInUserId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot follow yourself",
        });
      }

      return ctx.db.user.update({
        where: { id: loggedInUserId },
        data: { following: { connect: { id: input.id } } },
      });
    }),

  unfollow: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(({ input, ctx }) => {
      const loggedInUserId = ctx.session.user.id;

      if (input.id === loggedInUserId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot unfollow yourself",
        });
      }

      return ctx.db.user.update({
        where: { id: loggedInUserId },
        data: { following: { disconnect: { id: input.id } } },
      });
    }),
});
