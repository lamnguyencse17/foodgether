import { CartItem, createOrderSchema, getMemberCurrentOrderSchema } from "../schemas/order";
import { protectedProcedure } from "../trpc/trpc";
import { createOrder as createDbOrder, getExistingOrder, updateOrder } from "../db/order";
import { get } from "radash";
import { getOptionDictOfInvitation } from "../db/invitation";
import { getPusher } from "../service/pusher";
import { PUSHER_EVENTS } from "../common/constants";

export const createOrder = protectedProcedure
  .input(createOrderSchema)
  .mutation(async ({ ctx, input }) => {
    const newOrder = await createDbOrder(input, ctx.session.user.id);
    if (!newOrder) {
      return null;
    }
    const pusher = getPusher();
    await pusher.trigger(newOrder.invitationId, PUSHER_EVENTS.ORDER_UPDATE, newOrder);
    return newOrder;
  });

export const editOrder = protectedProcedure
  .input(createOrderSchema)
  .mutation(async ({ ctx, input }) => {
    const [_, newOrder] = await updateOrder(input, ctx.session.user.id);
    if (!newOrder) {
      return null;
    }
    const pusher = getPusher();
    await pusher.trigger(newOrder.invitationId, PUSHER_EVENTS.ORDER_UPDATE, newOrder);
    return newOrder;
  });

export const getMemberCurrentOrder = protectedProcedure
  .input(getMemberCurrentOrderSchema)
  .query(async ({ ctx, input }) => {
    const [order, invitation] = await Promise.all([
      getExistingOrder(ctx.prisma, input.invitationId, input.restaurantId, ctx.session.user.id),
      getOptionDictOfInvitation(ctx.prisma, input.invitationId),
    ]);
    if (!order || !invitation) {
      return [] as CartItem[];
    }
    const parsedCartData: CartItem[] = await Promise.all(
      order.orderDishes.map(async (orderDish) => ({
        id: orderDish.id,
        dishId: orderDish.invitationDishId,
        options: orderDish.orderDishOptions.map((option) => {
          const mandatory = get(
            invitation.optionDict,
            `${orderDish.invitationDishId}.${option.invitationOptionId}.isMandatory`,
            false,
          );
          return mandatory
            ? {
                id: option.id,
                optionId: option.invitationOptionId,
                mandatory: true,
                value: {
                  id: option.orderDishOptionItems[0]!.id,
                  price: 0,
                  optionItemId: option.orderDishOptionItems[0]!.invitationOptionItemId,
                },
              }
            : {
                id: option.id,
                optionId: option.invitationOptionId,
                mandatory: false,
                value: option.orderDishOptionItems.map((item) => ({
                  id: item.id,
                  price: 0,

                  optionItemId: item.invitationOptionItemId,
                })),
              };
        }),
      })),
    );
    return parsedCartData;
  });
