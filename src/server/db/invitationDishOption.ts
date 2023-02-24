import { Prisma } from "@prisma/client";
import { CreateInvitationRestaurantInput } from "./restaurant";

export const createInvitationDishOption = (
  tx: Prisma.TransactionClient,
  invitationRestaurantId: number,
  restaurant: CreateInvitationRestaurantInput,
) => {
  return tx.invitationDishOption.createMany({
    data: restaurant.dish.flatMap((dish) =>
      dish.dishOption.map((dishOption) => ({
        id: dishOption.id,
        dishId: dishOption.dishId,
        optionId: dishOption.optionId,
        invitationRestaurantId,
      })),
    ),
  });
};
