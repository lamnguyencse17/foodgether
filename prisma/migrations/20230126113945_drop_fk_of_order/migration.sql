/*
  Warnings:

  - Added the required column `restaurantData` to the `Invitation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "OrderDish" DROP CONSTRAINT "OrderDish_dishId_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "OrderDishOption" DROP CONSTRAINT "OrderDishOption_optionId_dishId_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "OrderDishOptionItem" DROP CONSTRAINT "OrderDishOptionItem_optionItemId_dishId_restaurantId_fkey";

-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "restaurantData" JSONB NOT NULL;
