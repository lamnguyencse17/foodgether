/*
  Warnings:

  - A unique constraint covering the columns `[id,restaurantId]` on the table `Dish` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Invitation" (
    "id" SERIAL NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "orderedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderDish" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "dishId" INTEGER NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderDish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderDishOption" (
    "id" SERIAL NOT NULL,
    "orderDishId" INTEGER NOT NULL,
    "optionId" INTEGER NOT NULL,
    "dishId" INTEGER NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderDishOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderDishOptionItem" (
    "id" SERIAL NOT NULL,
    "orderDishOptionId" INTEGER NOT NULL,
    "optionItemId" INTEGER NOT NULL,
    "optionItemDishId" INTEGER NOT NULL,
    "dishId" INTEGER NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderDishOptionItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Order_orderedById_createdAt_idx" ON "Order"("orderedById", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Dish_id_restaurantId_key" ON "Dish"("id", "restaurantId");

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_orderedById_fkey" FOREIGN KEY ("orderedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDish" ADD CONSTRAINT "OrderDish_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDish" ADD CONSTRAINT "OrderDish_dishId_restaurantId_fkey" FOREIGN KEY ("dishId", "restaurantId") REFERENCES "Dish"("id", "restaurantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDishOption" ADD CONSTRAINT "OrderDishOption_orderDishId_fkey" FOREIGN KEY ("orderDishId") REFERENCES "OrderDish"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDishOption" ADD CONSTRAINT "OrderDishOption_optionId_dishId_restaurantId_fkey" FOREIGN KEY ("optionId", "dishId", "restaurantId") REFERENCES "Option"("id", "dishId", "restaurantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDishOptionItem" ADD CONSTRAINT "OrderDishOptionItem_orderDishOptionId_fkey" FOREIGN KEY ("orderDishOptionId") REFERENCES "OrderDishOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDishOptionItem" ADD CONSTRAINT "OrderDishOptionItem_optionItemId_dishId_restaurantId_fkey" FOREIGN KEY ("optionItemId", "dishId", "restaurantId") REFERENCES "OptionItem"("id", "dishId", "restaurantId") ON DELETE CASCADE ON UPDATE CASCADE;
