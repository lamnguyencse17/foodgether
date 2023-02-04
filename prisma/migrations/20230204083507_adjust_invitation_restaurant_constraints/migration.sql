/*
  Warnings:

  - A unique constraint covering the columns `[id,restaurantId,deliveryId]` on the table `InvitationRestaurant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "InvitationRestaurant_deliveryId_key";

-- DropIndex
DROP INDEX "InvitationRestaurant_url_key";

-- CreateIndex
CREATE UNIQUE INDEX "InvitationRestaurant_id_restaurantId_deliveryId_key" ON "InvitationRestaurant"("id", "restaurantId", "deliveryId");
