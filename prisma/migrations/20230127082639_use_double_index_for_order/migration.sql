/*
  Warnings:

  - A unique constraint covering the columns `[orderedById,restaurantId,invitationId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Order_orderedById_restaurantId_invitationId_createdAt_key";

-- CreateIndex
CREATE INDEX "Order_restaurantId_invitationId_createdAt_idx" ON "Order"("restaurantId", "invitationId", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderedById_restaurantId_invitationId_key" ON "Order"("orderedById", "restaurantId", "invitationId");
