/*
  Warnings:

  - The `photos` column on the `Dish` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `photos` column on the `Restaurant` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Dish" DROP COLUMN "photos",
ADD COLUMN     "photos" JSONB[] DEFAULT ARRAY[]::JSONB[];

-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "photos",
ADD COLUMN     "photos" JSONB[] DEFAULT ARRAY[]::JSONB[];
