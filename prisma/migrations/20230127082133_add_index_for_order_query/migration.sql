-- DropIndex
DROP INDEX "Order_orderedById_createdAt_idx";

-- CreateIndex
CREATE INDEX "Order_orderedById_restaurantId_createdAt_idx" ON "Order"("orderedById", "restaurantId", "createdAt" DESC);
