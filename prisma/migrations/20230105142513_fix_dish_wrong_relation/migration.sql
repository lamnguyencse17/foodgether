/*
  Warnings:

  - You are about to drop the column `dishTypesId` on the `Dish` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Dish" DROP CONSTRAINT "Dish_dishTypesId_fkey";

-- AlterTable
ALTER TABLE "Dish" DROP COLUMN "dishTypesId";

-- CreateTable
CREATE TABLE "DishTypesAndDishes" (
    "id" SERIAL NOT NULL,
    "dishTypesId" INTEGER NOT NULL,
    "dishId" INTEGER NOT NULL,

    CONSTRAINT "DishTypesAndDishes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DishTypesAndDishes_dishTypesId_dishId_key" ON "DishTypesAndDishes"("dishTypesId", "dishId");

-- AddForeignKey
ALTER TABLE "DishTypesAndDishes" ADD CONSTRAINT "DishTypesAndDishes_dishTypesId_fkey" FOREIGN KEY ("dishTypesId") REFERENCES "DishTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DishTypesAndDishes" ADD CONSTRAINT "DishTypesAndDishes_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
