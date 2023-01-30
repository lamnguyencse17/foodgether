/*
  Warnings:

  - You are about to drop the column `maxQuantity` on the `DishOption` table. All the data in the column will be lost.
  - You are about to drop the column `minQuantity` on the `DishOption` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DishOption" DROP COLUMN "maxQuantity",
DROP COLUMN "minQuantity";
