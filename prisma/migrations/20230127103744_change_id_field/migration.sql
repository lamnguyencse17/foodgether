/*
  Warnings:

  - The primary key for the `OrderDish` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "OrderDishOption" DROP CONSTRAINT "OrderDishOption_orderDishId_fkey";

-- AlterTable
ALTER TABLE "OrderDish" DROP CONSTRAINT "OrderDish_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "OrderDish_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "OrderDish_id_seq";

-- AlterTable
ALTER TABLE "OrderDishOption" ALTER COLUMN "orderDishId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "OrderDishOption" ADD CONSTRAINT "OrderDishOption_orderDishId_fkey" FOREIGN KEY ("orderDishId") REFERENCES "OrderDish"("id") ON DELETE CASCADE ON UPDATE CASCADE;
