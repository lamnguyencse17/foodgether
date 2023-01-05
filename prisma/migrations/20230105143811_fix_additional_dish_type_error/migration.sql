/*
  Warnings:

  - You are about to drop the `DishTypesAndDishes` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[dishTypesAndDishesId]` on the table `DishTypes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dishTypesAndDishesId` to the `DishTypes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DishTypesAndDishes" DROP CONSTRAINT "DishTypesAndDishes_dishId_fkey";

-- DropForeignKey
ALTER TABLE "DishTypesAndDishes" DROP CONSTRAINT "DishTypesAndDishes_dishTypesId_fkey";

-- AlterTable
ALTER TABLE "DishTypes" ADD COLUMN     "dishTypesAndDishesId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "DishTypesAndDishes";

-- CreateTable
CREATE TABLE "DishTypeAndDishes" (
    "id" SERIAL NOT NULL,
    "dishId" INTEGER NOT NULL,

    CONSTRAINT "DishTypeAndDishes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DishTypeAndDishes_id_dishId_key" ON "DishTypeAndDishes"("id", "dishId");

-- CreateIndex
CREATE UNIQUE INDEX "DishTypes_dishTypesAndDishesId_key" ON "DishTypes"("dishTypesAndDishesId");

-- AddForeignKey
ALTER TABLE "DishTypes" ADD CONSTRAINT "DishTypes_dishTypesAndDishesId_fkey" FOREIGN KEY ("dishTypesAndDishesId") REFERENCES "DishTypeAndDishes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DishTypeAndDishes" ADD CONSTRAINT "DishTypeAndDishes_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
