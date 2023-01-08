/*
  Warnings:

  - The primary key for the `OptionItem` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "OptionItem" DROP CONSTRAINT "OptionItem_pkey",
ADD CONSTRAINT "OptionItem_pkey" PRIMARY KEY ("id", "dishId", "restaurantId");
