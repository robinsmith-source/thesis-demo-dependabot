import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const recipeLabelCategoryRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.recipeLabelCategory.findMany({
      select: {
        name: true,
        RecipeLabel: { select: { name: true } },
      }
    });
  })
});
