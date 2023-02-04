-- AlterTable
ALTER TABLE "InvitationOption" ALTER COLUMN "invitationId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "InvitationOption" ADD CONSTRAINT "InvitationOption_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
