/*
  Warnings:

  - The primary key for the `OrderDishOption` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `OrderDishOptionItem` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "OrderDishOptionItem" DROP CONSTRAINT "OrderDishOptionItem_orderDishOptionId_fkey";

-- AlterTable
ALTER TABLE "OrderDishOption" DROP CONSTRAINT "OrderDishOption_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "OrderDishOption_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "OrderDishOption_id_seq";

-- AlterTable
ALTER TABLE "OrderDishOptionItem" DROP CONSTRAINT "OrderDishOptionItem_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "orderDishOptionId" SET DATA TYPE TEXT,
ADD CONSTRAINT "OrderDishOptionItem_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "OrderDishOptionItem_id_seq";

-- AddForeignKey
ALTER TABLE "OrderDishOptionItem" ADD CONSTRAINT "OrderDishOptionItem_orderDishOptionId_fkey" FOREIGN KEY ("orderDishOptionId") REFERENCES "OrderDishOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
