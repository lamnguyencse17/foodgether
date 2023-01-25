/*
  Warnings:

  - You are about to drop the column `restaurantUrlId` on the `Invitation` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantUrlId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantUrlId` on the `OrderDish` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantUrlId` on the `OrderDishOption` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantUrlId` on the `OrderDishOptionItem` table. All the data in the column will be lost.
  - You are about to drop the `RestaurantUrl` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `restaurantId` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dishId` on table `OrderDish` required. This step will fail if there are existing NULL values in that column.
  - Made the column `restaurantId` on table `OrderDish` required. This step will fail if there are existing NULL values in that column.
  - Made the column `optionId` on table `OrderDishOption` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dishId` on table `OrderDishOption` required. This step will fail if there are existing NULL values in that column.
  - Made the column `restaurantId` on table `OrderDishOption` required. This step will fail if there are existing NULL values in that column.
  - Made the column `optionItemId` on table `OrderDishOptionItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dishId` on table `OrderDishOptionItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `restaurantId` on table `OrderDishOptionItem` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_restaurantUrlId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_restaurantUrlId_fkey";

-- DropForeignKey
ALTER TABLE "OrderDish" DROP CONSTRAINT "OrderDish_dishId_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "OrderDish" DROP CONSTRAINT "OrderDish_restaurantUrlId_fkey";

-- DropForeignKey
ALTER TABLE "OrderDishOption" DROP CONSTRAINT "OrderDishOption_optionId_dishId_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "OrderDishOption" DROP CONSTRAINT "OrderDishOption_restaurantUrlId_fkey";

-- DropForeignKey
ALTER TABLE "OrderDishOptionItem" DROP CONSTRAINT "OrderDishOptionItem_optionItemId_dishId_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "OrderDishOptionItem" DROP CONSTRAINT "OrderDishOptionItem_restaurantUrlId_fkey";

-- AlterTable
ALTER TABLE "Invitation" DROP COLUMN "restaurantUrlId";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "restaurantUrlId",
ALTER COLUMN "restaurantId" SET NOT NULL;

-- AlterTable
ALTER TABLE "OrderDish" DROP COLUMN "restaurantUrlId",
ALTER COLUMN "dishId" SET NOT NULL,
ALTER COLUMN "restaurantId" SET NOT NULL;

-- AlterTable
ALTER TABLE "OrderDishOption" DROP COLUMN "restaurantUrlId",
ALTER COLUMN "optionId" SET NOT NULL,
ALTER COLUMN "dishId" SET NOT NULL,
ALTER COLUMN "restaurantId" SET NOT NULL;

-- AlterTable
ALTER TABLE "OrderDishOptionItem" DROP COLUMN "restaurantUrlId",
ALTER COLUMN "optionItemId" SET NOT NULL,
ALTER COLUMN "dishId" SET NOT NULL,
ALTER COLUMN "restaurantId" SET NOT NULL;

-- DropTable
DROP TABLE "RestaurantUrl";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDish" ADD CONSTRAINT "OrderDish_dishId_restaurantId_fkey" FOREIGN KEY ("dishId", "restaurantId") REFERENCES "Dish"("id", "restaurantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDishOption" ADD CONSTRAINT "OrderDishOption_optionId_dishId_restaurantId_fkey" FOREIGN KEY ("optionId", "dishId", "restaurantId") REFERENCES "Option"("id", "dishId", "restaurantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDishOptionItem" ADD CONSTRAINT "OrderDishOptionItem_optionItemId_dishId_restaurantId_fkey" FOREIGN KEY ("optionItemId", "dishId", "restaurantId") REFERENCES "OptionItem"("id", "dishId", "restaurantId") ON DELETE CASCADE ON UPDATE CASCADE;
