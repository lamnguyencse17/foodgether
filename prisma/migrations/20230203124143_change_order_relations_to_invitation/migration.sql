/*
  Warnings:

  - You are about to drop the column `dishId` on the `OrderDish` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantId` on the `OrderDish` table. All the data in the column will be lost.
  - You are about to drop the column `dishId` on the `OrderDishOption` table. All the data in the column will be lost.
  - You are about to drop the column `optionId` on the `OrderDishOption` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantId` on the `OrderDishOption` table. All the data in the column will be lost.
  - You are about to drop the column `dishId` on the `OrderDishOptionItem` table. All the data in the column will be lost.
  - You are about to drop the column `optionItemId` on the `OrderDishOptionItem` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `OrderDishOptionItem` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantId` on the `OrderDishOptionItem` table. All the data in the column will be lost.
  - Added the required column `invitationDishId` to the `OrderDish` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invitationOptionId` to the `OrderDishOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invitationRestaurantId` to the `OrderDishOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invitationOptionItemDishId` to the `OrderDishOptionItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invitationOptionItemId` to the `OrderDishOptionItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invitationRestaurantId` to the `OrderDishOptionItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderDish" DROP COLUMN "dishId",
DROP COLUMN "restaurantId",
ADD COLUMN     "invitationDishId" INTEGER NOT NULL,
ADD COLUMN     "invitationRestaurantId" INTEGER;

-- AlterTable
ALTER TABLE "OrderDishOption" DROP COLUMN "dishId",
DROP COLUMN "optionId",
DROP COLUMN "restaurantId",
ADD COLUMN     "invitationOptionId" INTEGER NOT NULL,
ADD COLUMN     "invitationRestaurantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "OrderDishOptionItem" DROP COLUMN "dishId",
DROP COLUMN "optionItemId",
DROP COLUMN "price",
DROP COLUMN "restaurantId",
ADD COLUMN     "invitationOptionItemDishId" INTEGER NOT NULL,
ADD COLUMN     "invitationOptionItemId" INTEGER NOT NULL,
ADD COLUMN     "invitationRestaurantId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "OrderDish" ADD CONSTRAINT "OrderDish_invitationRestaurantId_fkey" FOREIGN KEY ("invitationRestaurantId") REFERENCES "InvitationRestaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDish" ADD CONSTRAINT "OrderDish_invitationDishId_fkey" FOREIGN KEY ("invitationDishId") REFERENCES "InvitationDish"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDishOption" ADD CONSTRAINT "OrderDishOption_invitationOptionId_invitationRestaurantId_fkey" FOREIGN KEY ("invitationOptionId", "invitationRestaurantId") REFERENCES "InvitationOption"("id", "invitationRestaurantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDishOption" ADD CONSTRAINT "OrderDishOption_invitationRestaurantId_fkey" FOREIGN KEY ("invitationRestaurantId") REFERENCES "InvitationRestaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDishOptionItem" ADD CONSTRAINT "OrderDishOptionItem_invitationOptionItemId_invitationOptio_fkey" FOREIGN KEY ("invitationOptionItemId", "invitationOptionItemDishId", "invitationRestaurantId") REFERENCES "InvitationOptionItem"("id", "dishId", "invitationRestaurantId") ON DELETE RESTRICT ON UPDATE CASCADE;
