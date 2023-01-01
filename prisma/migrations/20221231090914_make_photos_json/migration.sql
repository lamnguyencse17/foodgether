/*
  Warnings:

  - You are about to drop the `DishPhoto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RestaurantPhoto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DishPhoto" DROP CONSTRAINT "DishPhoto_dishId_fkey";

-- DropForeignKey
ALTER TABLE "RestaurantPhoto" DROP CONSTRAINT "RestaurantPhoto_restaurantId_fkey";

-- AlterTable
ALTER TABLE "Dish" ADD COLUMN     "photos" JSONB DEFAULT '[]';

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "photos" JSONB DEFAULT '[]';

-- DropTable
DROP TABLE "DishPhoto";

-- DropTable
DROP TABLE "RestaurantPhoto";
