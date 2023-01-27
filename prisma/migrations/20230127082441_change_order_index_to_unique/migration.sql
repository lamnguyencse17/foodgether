/*
  Warnings:

  - A unique constraint covering the columns `[orderedById,restaurantId,invitationId,createdAt]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Order_orderedById_restaurantId_createdAt_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderedById_restaurantId_invitationId_createdAt_key" ON "Order"("orderedById", "restaurantId", "invitationId", "createdAt" DESC);
