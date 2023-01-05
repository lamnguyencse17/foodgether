/*
  Warnings:

  - You are about to drop the column `dishTypesId` on the `DishTypeAndDishes` table. All the data in the column will be lost.
  - Added the required column `dishTypeId` to the `DishTypeAndDishes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DishTypeAndDishes" DROP CONSTRAINT "DishTypeAndDishes_dishTypesId_fkey";

-- AlterTable
ALTER TABLE "DishTypeAndDishes" DROP COLUMN "dishTypesId",
ADD COLUMN     "dishTypeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "DishTypeAndDishes" ADD CONSTRAINT "DishTypeAndDishes_dishTypeId_fkey" FOREIGN KEY ("dishTypeId") REFERENCES "DishTypes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
