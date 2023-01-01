/*
  Warnings:

  - You are about to drop the column `description` on the `Restaurant` table. All the data in the column will be lost.
  - Added the required column `address` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "description",
ADD COLUMN     "address" TEXT NOT NULL;
