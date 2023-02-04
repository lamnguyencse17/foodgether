/*
  Warnings:

  - You are about to drop the column `restaurantId` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderedById,invitationRestaurantId,invitationId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `invitationRestaurantId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Order_orderedById_restaurantId_invitationId_key";

-- DropIndex
DROP INDEX "Order_restaurantId_invitationId_createdAt_idx";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "restaurantId",
ADD COLUMN     "invitationRestaurantId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Order_invitationRestaurantId_invitationId_createdAt_idx" ON "Order"("invitationRestaurantId", "invitationId", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderedById_invitationRestaurantId_invitationId_key" ON "Order"("orderedById", "invitationRestaurantId", "invitationId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_invitationRestaurantId_fkey" FOREIGN KEY ("invitationRestaurantId") REFERENCES "InvitationRestaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
