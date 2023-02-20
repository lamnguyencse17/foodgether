import { Prisma } from "@prisma/client";
import { complyWithJson } from "../../utils/transform";
import { CreateInvitationRestaurantInput } from "./restaurant";

type invitationDishInputs = {
  id: number;
  name: string;
  price: Prisma.JsonObject;
  photos: Prisma.JsonObject;
  description: string;
  discountPrice: Prisma.JsonObject;
  isAvailable: boolean;
  isActive: boolean;
}[];

type invitationOptionInputs = {
  id: number;
  name: string;
  ntop: string;
  invitationId: string;
  minQuantity: number;
  maxQuantity: number;
}[];

type CreateInvitationRestaurantTxInputs = {
  restaurant: CreateInvitationRestaurantInput;
  invitationOptions: invitationOptionInputs;
  invitationDishes: invitationDishInputs;
};

export const createInvitationRestaurantTx = (
  tx: Prisma.TransactionClient,
  invitationId: string,
  { restaurant, invitationDishes, invitationOptions }: CreateInvitationRestaurantTxInputs,
) => {
  return tx.invitationRestaurant.create({
    data: {
      address: restaurant.address,
      name: restaurant.name,
      invitation: {
        connect: {
          id: invitationId,
        },
      },
      deliveryId: restaurant.deliveryId,
      photos: complyWithJson(restaurant.photos),
      position: complyWithJson(restaurant.position),
      priceRange: complyWithJson(restaurant.priceRange),
      url: restaurant.url,
      isAvailable: restaurant.isAvailable,
      isQualityMerchant: restaurant.isQualityMerchant,
      restaurantId: restaurant.id,
      invitationOptions: {
        createMany: {
          data: invitationOptions,
        },
      },
      invitationDishes: {
        createMany: {
          data: invitationDishes,
        },
      },
    },
  });
};
