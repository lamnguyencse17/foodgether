/*
  Warnings:

  - You are about to drop the column `optionItemConfigurationId` on the `OptionItem` table. All the data in the column will be lost.
  - You are about to drop the column `optionId` on the `OptionItemConfiguration` table. All the data in the column will be lost.
  - Added the required column `optionItemConfigurationDishId` to the `Option` table without a default value. This is not possible if the table is not empty.
  - Added the required column `optionItemConfigurationId` to the `Option` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OptionItem" DROP CONSTRAINT "OptionItem_optionItemConfigurationId_dishId_fkey";

-- DropForeignKey
ALTER TABLE "OptionItemConfiguration" DROP CONSTRAINT "OptionItemConfiguration_optionId_dishId_fkey";

-- AlterTable
ALTER TABLE "Option" ADD COLUMN     "optionItemConfigurationDishId" INTEGER NOT NULL,
ADD COLUMN     "optionItemConfigurationId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "OptionItem" DROP COLUMN "optionItemConfigurationId",
ADD COLUMN     "optionDishId" INTEGER,
ADD COLUMN     "optionId" INTEGER;

-- AlterTable
ALTER TABLE "OptionItemConfiguration" DROP COLUMN "optionId";

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_optionItemConfigurationId_optionItemConfigurationDi_fkey" FOREIGN KEY ("optionItemConfigurationId", "optionItemConfigurationDishId") REFERENCES "OptionItemConfiguration"("id", "dishId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionItem" ADD CONSTRAINT "OptionItem_optionId_optionDishId_fkey" FOREIGN KEY ("optionId", "optionDishId") REFERENCES "Option"("id", "dishId") ON DELETE SET NULL ON UPDATE CASCADE;
