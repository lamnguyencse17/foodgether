import { Prisma } from "@prisma/client";
import { CreateInvitationRestaurantInput } from "./restaurant";

export const createInvitationDishTypes = (
  tx: Prisma.TransactionClient,
  invitationRestaurantId: number,
  restaurant: CreateInvitationRestaurantInput
) => {
  return tx.invitationDishTypes.createMany({
    data: restaurant.dishTypes.map((dishType) => ({
      invitationRestaurantId,
      displayOrder: dishType.displayOrder,
      name: dishType.name,
      id: dishType.id,
    })),
  });
};
