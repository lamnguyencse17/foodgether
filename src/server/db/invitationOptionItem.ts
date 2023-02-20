import { Prisma } from "@prisma/client";
import { CreateInvitationRestaurantInput } from "./restaurant";

export const createInvitationOptionItem = (
  tx: Prisma.TransactionClient,
  invitationRestaurantId: number,
  invitationId: string,
  restaurant: CreateInvitationRestaurantInput,
) => {
  return tx.invitationOptionItem.createMany({
    data: restaurant.option.flatMap((option) =>
      option.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: !item.price ? Prisma.JsonNull : JSON.parse(JSON.stringify(item.price)),
        ntopPrice: !item.ntopPrice ? Prisma.JsonNull : JSON.parse(JSON.stringify(item.ntopPrice)),
        dishId: item.dishId,
        invitationRestaurantId,
        invitationOptionId: option.id,
        invitationId,
        maxQuantity: option.maxQuantity,
      })),
    ),
  });
};
