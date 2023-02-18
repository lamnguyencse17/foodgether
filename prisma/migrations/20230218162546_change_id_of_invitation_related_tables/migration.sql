/*
  Warnings:

  - The primary key for the `InvitationDish` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `InvitationDishOption` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `invitationRestaurantId` on table `OrderDish` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "InvitationDishOption" DROP CONSTRAINT "InvitationDishOption_dishId_fkey";

-- DropForeignKey
ALTER TABLE "InvitationDishTypeAndDishes" DROP CONSTRAINT "InvitationDishTypeAndDishes_dishId_fkey";

-- DropForeignKey
ALTER TABLE "OrderDish" DROP CONSTRAINT "OrderDish_invitationDishId_fkey";

-- DropIndex
DROP INDEX "InvitationDish_id_invitationRestaurantId_key";

-- DropIndex
DROP INDEX "InvitationDishOption_id_dishId_invitationRestaurantId_key";

-- AlterTable
ALTER TABLE "InvitationDish" DROP CONSTRAINT "InvitationDish_pkey",
ADD CONSTRAINT "InvitationDish_pkey" PRIMARY KEY ("id", "invitationRestaurantId");

-- AlterTable
ALTER TABLE "InvitationDishOption" DROP CONSTRAINT "InvitationDishOption_pkey",
ADD CONSTRAINT "InvitationDishOption_pkey" PRIMARY KEY ("id", "invitationRestaurantId");

-- AlterTable
ALTER TABLE "OrderDish" ALTER COLUMN "invitationRestaurantId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "OrderDish" ADD CONSTRAINT "OrderDish_invitationDishId_invitationRestaurantId_fkey" FOREIGN KEY ("invitationDishId", "invitationRestaurantId") REFERENCES "InvitationDish"("id", "invitationRestaurantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationDishTypeAndDishes" ADD CONSTRAINT "InvitationDishTypeAndDishes_dishId_invitationRestaurantId_fkey" FOREIGN KEY ("dishId", "invitationRestaurantId") REFERENCES "InvitationDish"("id", "invitationRestaurantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationDishOption" ADD CONSTRAINT "InvitationDishOption_dishId_invitationRestaurantId_fkey" FOREIGN KEY ("dishId", "invitationRestaurantId") REFERENCES "InvitationDish"("id", "invitationRestaurantId") ON DELETE CASCADE ON UPDATE CASCADE;
