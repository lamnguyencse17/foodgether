/*
  Warnings:

  - The primary key for the `Option` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `OptionItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `OptionItemConfiguration` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `dishId` on table `Option` required. This step will fail if there are existing NULL values in that column.
  - Made the column `optionItemConfigurationId` on table `OptionItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dishId` on table `OptionItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `optionId` on table `OptionItemConfiguration` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dishId` on table `OptionItemConfiguration` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "OptionItem" DROP CONSTRAINT "OptionItem_optionItemConfigurationId_fkey";

-- DropForeignKey
ALTER TABLE "OptionItemConfiguration" DROP CONSTRAINT "OptionItemConfiguration_optionId_fkey";

-- AlterTable
ALTER TABLE "Option" DROP CONSTRAINT "Option_pkey",
ALTER COLUMN "dishId" SET NOT NULL,
ADD CONSTRAINT "Option_pkey" PRIMARY KEY ("id", "dishId");

-- AlterTable
ALTER TABLE "OptionItem" DROP CONSTRAINT "OptionItem_pkey",
ALTER COLUMN "optionItemConfigurationId" SET NOT NULL,
ALTER COLUMN "dishId" SET NOT NULL,
ADD CONSTRAINT "OptionItem_pkey" PRIMARY KEY ("id", "dishId");

-- AlterTable
ALTER TABLE "OptionItemConfiguration" DROP CONSTRAINT "OptionItemConfiguration_pkey",
ALTER COLUMN "optionId" SET NOT NULL,
ALTER COLUMN "dishId" SET NOT NULL,
ADD CONSTRAINT "OptionItemConfiguration_pkey" PRIMARY KEY ("id", "dishId");

-- AddForeignKey
ALTER TABLE "OptionItemConfiguration" ADD CONSTRAINT "OptionItemConfiguration_optionId_dishId_fkey" FOREIGN KEY ("optionId", "dishId") REFERENCES "Option"("id", "dishId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionItem" ADD CONSTRAINT "OptionItem_optionItemConfigurationId_dishId_fkey" FOREIGN KEY ("optionItemConfigurationId", "dishId") REFERENCES "OptionItemConfiguration"("id", "dishId") ON DELETE CASCADE ON UPDATE CASCADE;
