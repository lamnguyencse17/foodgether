/*
  Warnings:

  - You are about to drop the column `restaurantData` on the `Invitation` table. All the data in the column will be lost.
  - Added the required column `dishDict` to the `Invitation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `optionDict` to the `Invitation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurant` to the `Invitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invitation" DROP COLUMN "restaurantData",
ADD COLUMN     "dishDict" JSONB NOT NULL,
ADD COLUMN     "optionDict" JSONB NOT NULL,
ADD COLUMN     "restaurant" JSONB NOT NULL;
