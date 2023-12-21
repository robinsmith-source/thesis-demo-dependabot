-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_authorId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeReview" DROP CONSTRAINT "RecipeReview_authorId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeReview" DROP CONSTRAINT "RecipeReview_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeStep" DROP CONSTRAINT "RecipeStep_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeStepIngredient" DROP CONSTRAINT "RecipeStepIngredient_recipeStepId_fkey";

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeStep" ADD CONSTRAINT "RecipeStep_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeStepIngredient" ADD CONSTRAINT "RecipeStepIngredient_recipeStepId_fkey" FOREIGN KEY ("recipeStepId") REFERENCES "RecipeStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeReview" ADD CONSTRAINT "RecipeReview_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeReview" ADD CONSTRAINT "RecipeReview_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
