/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Restaurant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Dish" DROP CONSTRAINT "Dish_dishTypesId_fkey";

-- DropForeignKey
ALTER TABLE "DishTypes" DROP CONSTRAINT "DishTypes_restaurantId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_url_key" ON "Restaurant"("url");

-- AddForeignKey
ALTER TABLE "DishTypes" ADD CONSTRAINT "DishTypes_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dish" ADD CONSTRAINT "Dish_dishTypesId_fkey" FOREIGN KEY ("dishTypesId") REFERENCES "DishTypes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
