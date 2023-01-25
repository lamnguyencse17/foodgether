/*
  Warnings:

  - You are about to drop the column `orderRefereceId` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderReferenceId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderReferenceId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_orderRefereceId_fkey";

-- DropIndex
DROP INDEX "Order_orderRefereceId_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "orderRefereceId",
ADD COLUMN     "orderReferenceId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderReferenceId_key" ON "Order"("orderReferenceId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_orderReferenceId_fkey" FOREIGN KEY ("orderReferenceId") REFERENCES "OrderReference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
