/*
  Warnings:

  - A unique constraint covering the columns `[id,restaurantId]` on the table `DishTypes` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "DishTypes_id_key";

-- AlterTable
ALTER TABLE "DishTypes" ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "DishTypes_id_restaurantId_key" ON "DishTypes"("id", "restaurantId");
