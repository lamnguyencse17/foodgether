import { Prisma } from "@prisma/client";
import { createInvitationTx } from "../db/invitation";
import { createInvitationDishOption } from "../db/invitationDishOption";
import { createInvitationDishTypes } from "../db/invitationDishTypes";
import { createInvitationDishTypesAndDishes } from "../db/invitationDishTypesAndDishes";
import { createInvitationOptionItem } from "../db/invitationOptionItem";
import { createInvitationRestaurantTx } from "../db/invitationRestaurant";
import { getRestaurantForInvitationCreation } from "../db/restaurant";
import { createInvitationSchema } from "../schemas/invitation";
import { protectedProcedure } from "../trpc/trpc";

export const createNewInvitation = protectedProcedure
  .input(createInvitationSchema)
  .mutation(async ({ ctx, input }) => {
    const restaurant = await getRestaurantForInvitationCreation(
      ctx.prisma,
      input.restaurantId
    );
    if (!restaurant) {
      return null;
    }

    const invitationDishes = restaurant.dish.map((dish) => ({
      id: dish.id,
      name: dish.name,
      price: !dish.price
        ? Prisma.JsonNull
        : JSON.parse(JSON.stringify(dish.price)),
      photos: !dish.photos
        ? Prisma.JsonNull
        : JSON.parse(JSON.stringify(dish.photos)),
      description: dish.description,
      discountPrice: !dish.discountPrice
        ? Prisma.JsonNull
        : JSON.parse(JSON.stringify(dish.discountPrice)),
      isAvailable: dish.isAvailable,
      isActive: dish.isActive,
    }));

    return ctx.prisma.$transaction(
      async (tx) => {
        const invitation = await createInvitationTx(tx, ctx.session.user.id);
        const invitationOptions = restaurant.option.map((option) => ({
          id: option.id,
          name: option.name,
          ntop: option.ntop,
          invitationId: invitation.id,
          minQuantity: option.minQuantity,
          maxQuantity: option.maxQuantity,
        }));
        const invitationRestaurant = await createInvitationRestaurantTx(
          tx,
          invitation.id,
          { restaurant, invitationDishes, invitationOptions }
        );
        await createInvitationDishTypes(
          tx,
          invitationRestaurant.id,
          restaurant
        );
        await createInvitationDishTypesAndDishes(
          tx,
          invitationRestaurant.id,
          restaurant
        );
        await createInvitationDishOption(
          tx,
          invitationRestaurant.id,
          restaurant
        );
        await createInvitationOptionItem(
          tx,
          invitationRestaurant.id,
          invitation.id,
          restaurant
        );
        return invitation.id;
      },
      {
        timeout: 9000,
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      }
    );
  });
