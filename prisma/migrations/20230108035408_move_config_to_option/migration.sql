/*
  Warnings:

  - You are about to drop the column `optionItemConfigurationDishId` on the `Option` table. All the data in the column will be lost.
  - You are about to drop the column `optionItemConfigurationId` on the `Option` table. All the data in the column will be lost.
  - You are about to drop the `OptionItemConfiguration` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `maxQuantity` to the `Option` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minQuantity` to the `Option` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_optionItemConfigurationId_optionItemConfigurationDi_fkey";

-- AlterTable
ALTER TABLE "Option" DROP COLUMN "optionItemConfigurationDishId",
DROP COLUMN "optionItemConfigurationId",
ADD COLUMN     "maxQuantity" INTEGER NOT NULL,
ADD COLUMN     "minQuantity" INTEGER NOT NULL;

-- DropTable
DROP TABLE "OptionItemConfiguration";
