-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'COMFIRMED', 'COMPLETED', 'EXPIRED');

-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "status" "InvitationStatus" NOT NULL DEFAULT 'ACTIVE';
