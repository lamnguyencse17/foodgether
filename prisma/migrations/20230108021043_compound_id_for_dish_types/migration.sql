/*
  Warnings:

  - The primary key for the `DishTypes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `restaurantId` to the `DishTypeAndDishes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DishTypeAndDishes" DROP CONSTRAINT "DishTypeAndDishes_dishTypeId_fkey";

-- AlterTable
ALTER TABLE "DishTypeAndDishes" ADD COLUMN     "restaurantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "DishTypes" DROP CONSTRAINT "DishTypes_pkey",
ADD CONSTRAINT "DishTypes_pkey" PRIMARY KEY ("id", "restaurantId");

-- CreateIndex
CREATE INDEX "displayOrder" ON "DishTypes"("displayOrder");

-- AddForeignKey
ALTER TABLE "DishTypeAndDishes" ADD CONSTRAINT "DishTypeAndDishes_dishTypeId_restaurantId_fkey" FOREIGN KEY ("dishTypeId", "restaurantId") REFERENCES "DishTypes"("id", "restaurantId") ON DELETE CASCADE ON UPDATE CASCADE;
