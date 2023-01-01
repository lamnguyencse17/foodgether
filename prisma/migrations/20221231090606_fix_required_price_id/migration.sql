-- DropForeignKey
ALTER TABLE "Dish" DROP CONSTRAINT "Dish_priceId_fkey";

-- AlterTable
ALTER TABLE "Dish" ALTER COLUMN "priceId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Dish" ADD CONSTRAINT "Dish_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "Price"("id") ON DELETE SET NULL ON UPDATE CASCADE;
