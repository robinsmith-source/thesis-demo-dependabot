import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const recipeLabelRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.recipeLabel.findMany({
      select: {
        name: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });
  }),
});
