import { CartItem, createOrderSchema, getMemberCurrentOrderSchema } from "../schemas/order";
import { auditOrder } from "../service/audit";
import { protectedProcedure } from "../trpc/trpc";
import { createOrder as createDbOrder, getExistingOrder, updateOrder } from "../db/order";
import { get } from "radash";
import { getOptionDictOfInvitation } from "../db/invitation";

export const createOrder = protectedProcedure
  .input(createOrderSchema)
  .mutation(async ({ ctx, input }) => {
    await auditOrder(input);
    return createDbOrder(input, ctx.session.user.id);
  });

export const editOrder = protectedProcedure
  .input(createOrderSchema)
  .mutation(async ({ ctx, input }) => {
    await auditOrder(input);
    return updateOrder(input, ctx.session.user.id);
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
        dishPrice: orderDish.dishPrice,
        totalPrice: orderDish.totalPrice,
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
                price: option.price,
                mandatory: true,
                value: {
                  id: option.orderDishOptionItems[0]!.id,
                  // TODO: Fix missing price in this
                  // price: option.orderDishOptionItems[0]!.,
                  price: 0,
                  optionItemId: option.orderDishOptionItems[0]!.invitationOptionItemId,
                },
              }
            : {
                id: option.id,
                optionId: option.invitationOptionId,
                price: option.price,
                mandatory: false,
                value: option.orderDishOptionItems.map((item) => ({
                  id: item.id,
                  // TODO: Fix missing price in this
                  // price: item.price,
                  price: 0,

                  optionItemId: item.invitationOptionItemId,
                })),
              };
        }),
      })),
    );
    return parsedCartData;
  });
