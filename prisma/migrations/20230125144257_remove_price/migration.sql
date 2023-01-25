/*
  Warnings:

  - You are about to drop the column `price` on the `OrderDishOptionItemReference` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `OrderDishOptionReference` table. All the data in the column will be lost.
  - You are about to drop the column `dishPrice` on the `OrderDishReference` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `OrderDishReference` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrderDishOptionItemReference" DROP COLUMN "price";

-- AlterTable
ALTER TABLE "OrderDishOptionReference" DROP COLUMN "price";

-- AlterTable
ALTER TABLE "OrderDishReference" DROP COLUMN "dishPrice",
DROP COLUMN "totalPrice";
