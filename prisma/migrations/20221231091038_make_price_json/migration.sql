/*
  Warnings:

  - You are about to drop the column `discountedPriceId` on the `Dish` table. All the data in the column will be lost.
  - You are about to drop the column `priceId` on the `Dish` table. All the data in the column will be lost.
  - You are about to drop the `Price` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `discountPrice` to the `Dish` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Dish` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Dish" DROP CONSTRAINT "Dish_discountedPriceId_fkey";

-- DropForeignKey
ALTER TABLE "Dish" DROP CONSTRAINT "Dish_priceId_fkey";

-- DropIndex
DROP INDEX "Dish_discountedPriceId_key";

-- DropIndex
DROP INDEX "Dish_priceId_key";

-- AlterTable
ALTER TABLE "Dish" DROP COLUMN "discountedPriceId",
DROP COLUMN "priceId",
ADD COLUMN     "discountPrice" JSONB NOT NULL,
ADD COLUMN     "price" JSONB NOT NULL;

-- DropTable
DROP TABLE "Price";
