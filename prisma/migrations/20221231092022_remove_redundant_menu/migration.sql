/*
  Warnings:

  - You are about to drop the column `menuId` on the `DishTypes` table. All the data in the column will be lost.
  - You are about to drop the column `menuId` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the `Menu` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `restaurantId` to the `DishTypes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DishTypes" DROP CONSTRAINT "DishTypes_menuId_fkey";

-- DropForeignKey
ALTER TABLE "Restaurant" DROP CONSTRAINT "Restaurant_menuId_fkey";

-- DropIndex
DROP INDEX "Restaurant_menuId_key";

-- AlterTable
ALTER TABLE "DishTypes" DROP COLUMN "menuId",
ADD COLUMN     "restaurantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "menuId";

-- DropTable
DROP TABLE "Menu";

-- AddForeignKey
ALTER TABLE "DishTypes" ADD CONSTRAINT "DishTypes_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
