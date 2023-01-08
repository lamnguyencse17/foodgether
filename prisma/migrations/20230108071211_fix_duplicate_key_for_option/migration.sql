/*
  Warnings:

  - The primary key for the `Option` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `restaurantId` to the `Option` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurantId` to the `OptionItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OptionItem" DROP CONSTRAINT "OptionItem_optionId_dishId_fkey";

-- AlterTable
ALTER TABLE "Option" DROP CONSTRAINT "Option_pkey",
ADD COLUMN     "restaurantId" INTEGER NOT NULL,
ADD CONSTRAINT "Option_pkey" PRIMARY KEY ("id", "dishId", "restaurantId");

-- AlterTable
ALTER TABLE "OptionItem" ADD COLUMN     "restaurantId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionItem" ADD CONSTRAINT "OptionItem_optionId_dishId_restaurantId_fkey" FOREIGN KEY ("optionId", "dishId", "restaurantId") REFERENCES "Option"("id", "dishId", "restaurantId") ON DELETE CASCADE ON UPDATE CASCADE;
