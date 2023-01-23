/*
  Warnings:

  - Added the required column `dishPrice` to the `OrderDish` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `OrderDish` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `OrderDishOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `OrderDishOptionItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderDish" ADD COLUMN     "dishPrice" INTEGER NOT NULL,
ADD COLUMN     "totalPrice" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "OrderDishOption" ADD COLUMN     "price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "OrderDishOptionItem" ADD COLUMN     "price" INTEGER NOT NULL;
