-- AddForeignKey
ALTER TABLE "InvitationOptionItem" ADD CONSTRAINT "InvitationOptionItem_invitationRestaurantId_fkey" FOREIGN KEY ("invitationRestaurantId") REFERENCES "InvitationRestaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
