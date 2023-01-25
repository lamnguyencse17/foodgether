/*
  Warnings:

  - A unique constraint covering the columns `[invitationReferenceId]` on the table `Invitation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderRefereceId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderDishReferenceId]` on the table `OrderDish` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderDishOptionReferenceId]` on the table `OrderDishOption` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderDishOptionItemReferenceId]` on the table `OrderDishOptionItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `invitationReferenceId` to the `Invitation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderRefereceId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderDishReferenceId` to the `OrderDish` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderDishOptionReferenceId` to the `OrderDishOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderDishOptionItemReferenceId` to the `OrderDishOptionItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "invitationReferenceId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "orderRefereceId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "OrderDish" ADD COLUMN     "orderDishReferenceId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "OrderDishOption" ADD COLUMN     "orderDishOptionReferenceId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "OrderDishOptionItem" ADD COLUMN     "orderDishOptionItemReferenceId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "OrderDishOptionItemReference" (
    "id" SERIAL NOT NULL,
    "optionItemId" INTEGER NOT NULL,
    "dishId" INTEGER NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "OrderDishOptionItemReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderDishOptionReference" (
    "id" SERIAL NOT NULL,
    "optionId" INTEGER NOT NULL,
    "dishId" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "OrderDishOptionReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderDishReference" (
    "id" SERIAL NOT NULL,
    "dishId" INTEGER NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "dishPrice" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,

    CONSTRAINT "OrderDishReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderReference" (
    "id" SERIAL NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "invitationId" TEXT NOT NULL,
    "orderedById" TEXT NOT NULL,
    "orderId" INTEGER,

    CONSTRAINT "OrderReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvitationReference" (
    "id" SERIAL NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "InvitationReference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_invitationReferenceId_key" ON "Invitation"("invitationReferenceId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderRefereceId_key" ON "Order"("orderRefereceId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderDish_orderDishReferenceId_key" ON "OrderDish"("orderDishReferenceId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderDishOption_orderDishOptionReferenceId_key" ON "OrderDishOption"("orderDishOptionReferenceId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderDishOptionItem_orderDishOptionItemReferenceId_key" ON "OrderDishOptionItem"("orderDishOptionItemReferenceId");

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_invitationReferenceId_fkey" FOREIGN KEY ("invitationReferenceId") REFERENCES "InvitationReference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_orderRefereceId_fkey" FOREIGN KEY ("orderRefereceId") REFERENCES "OrderReference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDish" ADD CONSTRAINT "OrderDish_orderDishReferenceId_fkey" FOREIGN KEY ("orderDishReferenceId") REFERENCES "OrderDishReference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDishOption" ADD CONSTRAINT "OrderDishOption_orderDishOptionReferenceId_fkey" FOREIGN KEY ("orderDishOptionReferenceId") REFERENCES "OrderDishOptionReference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDishOptionItem" ADD CONSTRAINT "OrderDishOptionItem_orderDishOptionItemReferenceId_fkey" FOREIGN KEY ("orderDishOptionItemReferenceId") REFERENCES "OrderDishOptionItemReference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
