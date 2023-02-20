import { Prisma } from "@prisma/client";
import { CreateInvitationRestaurantInput } from "./restaurant";

export const createInvitationDishTypesAndDishes = (
  tx: Prisma.TransactionClient,
  invitationRestaurantId: number,
  restaurant: CreateInvitationRestaurantInput,
) => {
  return tx.invitationDishTypeAndDishes.createMany({
    data: restaurant.dish.flatMap((dish) =>
      dish.dishTypeAndDishes.map((dishTypeAndDishes) => ({
        invitationRestaurantId,
        dishId: dish.id,
        dishTypeId: dishTypeAndDishes.dishTypeId,
      })),
    ),
  });
};
