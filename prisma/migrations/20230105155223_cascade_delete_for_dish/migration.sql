-- DropForeignKey
ALTER TABLE "Dish" DROP CONSTRAINT "Dish_restaurantId_fkey";

-- AddForeignKey
ALTER TABLE "Dish" ADD CONSTRAINT "Dish_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
