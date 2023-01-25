-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_orderedById_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "OrderDish" DROP CONSTRAINT "OrderDish_dishId_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "OrderDishOption" DROP CONSTRAINT "OrderDishOption_optionId_dishId_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "OrderDishOptionItem" DROP CONSTRAINT "OrderDishOptionItem_optionItemId_dishId_restaurantId_fkey";

-- AlterTable
ALTER TABLE "Invitation" ALTER COLUMN "restaurantId" DROP NOT NULL,
ALTER COLUMN "createdById" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "restaurantId" DROP NOT NULL,
ALTER COLUMN "orderedById" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OrderDish" ALTER COLUMN "dishId" DROP NOT NULL,
ALTER COLUMN "restaurantId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OrderDishOption" ALTER COLUMN "optionId" DROP NOT NULL,
ALTER COLUMN "dishId" DROP NOT NULL,
ALTER COLUMN "restaurantId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OrderDishOptionItem" ALTER COLUMN "optionItemId" DROP NOT NULL,
ALTER COLUMN "dishId" DROP NOT NULL,
ALTER COLUMN "restaurantId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_orderedById_fkey" FOREIGN KEY ("orderedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDish" ADD CONSTRAINT "OrderDish_dishId_restaurantId_fkey" FOREIGN KEY ("dishId", "restaurantId") REFERENCES "Dish"("id", "restaurantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDishOption" ADD CONSTRAINT "OrderDishOption_optionId_dishId_restaurantId_fkey" FOREIGN KEY ("optionId", "dishId", "restaurantId") REFERENCES "Option"("id", "dishId", "restaurantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDishOptionItem" ADD CONSTRAINT "OrderDishOptionItem_optionItemId_dishId_restaurantId_fkey" FOREIGN KEY ("optionItemId", "dishId", "restaurantId") REFERENCES "OptionItem"("id", "dishId", "restaurantId") ON DELETE SET NULL ON UPDATE CASCADE;
