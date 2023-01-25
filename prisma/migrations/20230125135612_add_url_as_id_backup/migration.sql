-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "OrderDish" DROP CONSTRAINT "OrderDish_dishId_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "OrderDishOption" DROP CONSTRAINT "OrderDishOption_optionId_dishId_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "OrderDishOptionItem" DROP CONSTRAINT "OrderDishOptionItem_optionItemId_dishId_restaurantId_fkey";

-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "restaurantUrlId" INTEGER;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "restaurantUrlId" INTEGER,
ALTER COLUMN "restaurantId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OrderDish" ADD COLUMN     "restaurantUrlId" INTEGER,
ALTER COLUMN "dishId" DROP NOT NULL,
ALTER COLUMN "restaurantId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OrderDishOption" ADD COLUMN     "restaurantUrlId" INTEGER,
ALTER COLUMN "optionId" DROP NOT NULL,
ALTER COLUMN "dishId" DROP NOT NULL,
ALTER COLUMN "restaurantId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OrderDishOptionItem" ADD COLUMN     "restaurantUrlId" INTEGER,
ALTER COLUMN "optionItemId" DROP NOT NULL,
ALTER COLUMN "dishId" DROP NOT NULL,
ALTER COLUMN "restaurantId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "RestaurantUrl" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "deliveryId" INTEGER NOT NULL,

    CONSTRAINT "RestaurantUrl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantUrl_restaurantId_key" ON "RestaurantUrl"("restaurantId");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantUrl_url_key" ON "RestaurantUrl"("url");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantUrl_deliveryId_key" ON "RestaurantUrl"("deliveryId");

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_restaurantUrlId_fkey" FOREIGN KEY ("restaurantUrlId") REFERENCES "RestaurantUrl"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_restaurantUrlId_fkey" FOREIGN KEY ("restaurantUrlId") REFERENCES "RestaurantUrl"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDish" ADD CONSTRAINT "OrderDish_dishId_restaurantId_fkey" FOREIGN KEY ("dishId", "restaurantId") REFERENCES "Dish"("id", "restaurantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDish" ADD CONSTRAINT "OrderDish_restaurantUrlId_fkey" FOREIGN KEY ("restaurantUrlId") REFERENCES "RestaurantUrl"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDishOption" ADD CONSTRAINT "OrderDishOption_optionId_dishId_restaurantId_fkey" FOREIGN KEY ("optionId", "dishId", "restaurantId") REFERENCES "Option"("id", "dishId", "restaurantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDishOption" ADD CONSTRAINT "OrderDishOption_restaurantUrlId_fkey" FOREIGN KEY ("restaurantUrlId") REFERENCES "RestaurantUrl"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDishOptionItem" ADD CONSTRAINT "OrderDishOptionItem_optionItemId_dishId_restaurantId_fkey" FOREIGN KEY ("optionItemId", "dishId", "restaurantId") REFERENCES "OptionItem"("id", "dishId", "restaurantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDishOptionItem" ADD CONSTRAINT "OrderDishOptionItem_restaurantUrlId_fkey" FOREIGN KEY ("restaurantUrlId") REFERENCES "RestaurantUrl"("id") ON DELETE SET NULL ON UPDATE CASCADE;
