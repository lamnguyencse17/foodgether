/*
  Warnings:

  - You are about to drop the column `dishPrice` on the `OrderDish` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `OrderDish` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `OrderDishOption` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrderDish" DROP COLUMN "dishPrice",
DROP COLUMN "totalPrice";

-- AlterTable
ALTER TABLE "OrderDishOption" DROP COLUMN "price";
