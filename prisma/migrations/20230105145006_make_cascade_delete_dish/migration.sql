-- DropForeignKey
ALTER TABLE "DishTypeAndDishes" DROP CONSTRAINT "DishTypeAndDishes_dishId_fkey";

-- AddForeignKey
ALTER TABLE "DishTypeAndDishes" ADD CONSTRAINT "DishTypeAndDishes_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE CASCADE ON UPDATE CASCADE;
