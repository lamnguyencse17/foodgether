-- DropIndex
DROP INDEX "DishTypes_menuId_key";

-- AlterTable
ALTER TABLE "Menu" ALTER COLUMN "restaurantId" DROP NOT NULL;
