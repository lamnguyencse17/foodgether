/*
  Warnings:

  - You are about to drop the column `invitationDishTypesId` on the `DishTypeAndDishes` table. All the data in the column will be lost.
  - You are about to drop the column `invitationDishTypesInvitationRestaurantId` on the `DishTypeAndDishes` table. All the data in the column will be lost.
  - You are about to drop the column `invitationDishTypesRestaurantId` on the `DishTypeAndDishes` table. All the data in the column will be lost.
  - The primary key for the `InvitationOptionItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `invitationOptionRestaurantId` on the `InvitationOptionItem` table. All the data in the column will be lost.
  - You are about to drop the column `optionId` on the `InvitationOptionItem` table. All the data in the column will be lost.
  - Added the required column `invitationId` to the `InvitationOptionItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invitationRestaurantId` to the `InvitationOptionItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DishTypeAndDishes" DROP CONSTRAINT "DishTypeAndDishes_invitationDishTypesId_invitationDishType_fkey";

-- DropForeignKey
ALTER TABLE "InvitationOptionItem" DROP CONSTRAINT "InvitationOptionItem_invitationOptionId_invitationOptionRe_fkey";

-- AlterTable
ALTER TABLE "DishTypeAndDishes" DROP COLUMN "invitationDishTypesId",
DROP COLUMN "invitationDishTypesInvitationRestaurantId",
DROP COLUMN "invitationDishTypesRestaurantId";

-- AlterTable
ALTER TABLE "InvitationOptionItem" DROP CONSTRAINT "InvitationOptionItem_pkey",
DROP COLUMN "invitationOptionRestaurantId",
DROP COLUMN "optionId",
ADD COLUMN     "invitationId" TEXT NOT NULL,
ADD COLUMN     "invitationRestaurantId" INTEGER NOT NULL,
ADD CONSTRAINT "InvitationOptionItem_pkey" PRIMARY KEY ("id", "dishId", "invitationRestaurantId");

-- AddForeignKey
ALTER TABLE "InvitationOptionItem" ADD CONSTRAINT "InvitationOptionItem_invitationOptionId_invitationRestaura_fkey" FOREIGN KEY ("invitationOptionId", "invitationRestaurantId") REFERENCES "InvitationOption"("id", "invitationRestaurantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationOptionItem" ADD CONSTRAINT "InvitationOptionItem_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
