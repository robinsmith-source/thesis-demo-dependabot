/*
  Warnings:

  - You are about to drop the column `recipeId` on the `RecipeLabel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `RecipeLabel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `RecipeLabelCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "RecipeLabel" DROP CONSTRAINT "RecipeLabel_recipeId_fkey";

-- AlterTable
ALTER TABLE "RecipeLabel" DROP COLUMN "recipeId";

-- CreateTable
CREATE TABLE "_RecipeLabels" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RecipeLabels_AB_unique" ON "_RecipeLabels"("A", "B");

-- CreateIndex
CREATE INDEX "_RecipeLabels_B_index" ON "_RecipeLabels"("B");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeLabel_name_key" ON "RecipeLabel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeLabelCategory_name_key" ON "RecipeLabelCategory"("name");

-- AddForeignKey
ALTER TABLE "_RecipeLabels" ADD CONSTRAINT "_RecipeLabels_A_fkey" FOREIGN KEY ("A") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipeLabels" ADD CONSTRAINT "_RecipeLabels_B_fkey" FOREIGN KEY ("B") REFERENCES "RecipeLabel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
