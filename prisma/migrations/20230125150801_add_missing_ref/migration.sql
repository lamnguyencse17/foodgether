/*
  Warnings:

  - Added the required column `restaurantId` to the `OrderDishOptionReference` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderDishOptionReference" ADD COLUMN     "restaurantId" INTEGER NOT NULL;
