/*
  Warnings:

  - Changed the type of `photos` on the `Dish` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `photos` on the `Restaurant` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Dish" DROP COLUMN "photos",
ADD COLUMN     "photos" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "photos",
ADD COLUMN     "photos" JSONB NOT NULL;
