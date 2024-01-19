import { createTRPCRouter } from "~/server/api/trpc";
import { recipeRouter } from "~/server/api/routers/recipe";
import { userRouter } from "~/server/api/routers/user";
import { reviewRouter } from "~/server/api/routers/review";
import { shoppingListRouter } from "~/server/api/routers/shoppingList";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  recipe: recipeRouter,
  user: userRouter,
  review: reviewRouter,
  shoppingList: shoppingListRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
