/*
  Warnings:

  - You are about to drop the column `dishTypesAndDishesId` on the `DishTypes` table. All the data in the column will be lost.
  - Added the required column `dishTypesId` to the `DishTypeAndDishes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DishTypes" DROP CONSTRAINT "DishTypes_dishTypesAndDishesId_fkey";

-- DropIndex
DROP INDEX "DishTypes_dishTypesAndDishesId_key";

-- AlterTable
ALTER TABLE "DishTypeAndDishes" ADD COLUMN     "dishTypesId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "DishTypes" DROP COLUMN "dishTypesAndDishesId";

-- AddForeignKey
ALTER TABLE "DishTypeAndDishes" ADD CONSTRAINT "DishTypeAndDishes_dishTypesId_fkey" FOREIGN KEY ("dishTypesId") REFERENCES "DishTypes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
