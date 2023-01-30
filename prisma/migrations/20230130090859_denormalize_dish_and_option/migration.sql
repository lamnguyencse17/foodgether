/*
  Warnings:

  - The primary key for the `Option` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dishId` on the `Option` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_dishId_fkey";

-- DropForeignKey
ALTER TABLE "OptionItem" DROP CONSTRAINT "OptionItem_optionId_dishId_restaurantId_fkey";

-- DropIndex
DROP INDEX "Option_dishId_restaurantId_idx";

-- AlterTable
ALTER TABLE "Option" DROP CONSTRAINT "Option_pkey",
DROP COLUMN "dishId",
ADD CONSTRAINT "Option_pkey" PRIMARY KEY ("id", "restaurantId");

-- CreateTable
CREATE TABLE "DishOption" (
    "id" SERIAL NOT NULL,
    "dishId" INTEGER NOT NULL,
    "optionId" INTEGER NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "minQuantity" INTEGER NOT NULL,
    "maxQuantity" INTEGER NOT NULL,

    CONSTRAINT "DishOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DishOption_id_dishId_restaurantId_key" ON "DishOption"("id", "dishId", "restaurantId");

-- CreateIndex
CREATE INDEX "Option_restaurantId_idx" ON "Option"("restaurantId");

-- AddForeignKey
ALTER TABLE "DishOption" ADD CONSTRAINT "DishOption_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DishOption" ADD CONSTRAINT "DishOption_optionId_restaurantId_fkey" FOREIGN KEY ("optionId", "restaurantId") REFERENCES "Option"("id", "restaurantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionItem" ADD CONSTRAINT "OptionItem_optionId_restaurantId_fkey" FOREIGN KEY ("optionId", "restaurantId") REFERENCES "Option"("id", "restaurantId") ON DELETE CASCADE ON UPDATE CASCADE;
