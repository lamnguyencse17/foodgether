/*
  Warnings:

  - You are about to drop the column `optionDishId` on the `OptionItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "OptionItem" DROP CONSTRAINT "OptionItem_optionId_optionDishId_fkey";

-- AlterTable
ALTER TABLE "OptionItem" DROP COLUMN "optionDishId";

-- AddForeignKey
ALTER TABLE "OptionItem" ADD CONSTRAINT "OptionItem_optionId_dishId_fkey" FOREIGN KEY ("optionId", "dishId") REFERENCES "Option"("id", "dishId") ON DELETE CASCADE ON UPDATE CASCADE;
