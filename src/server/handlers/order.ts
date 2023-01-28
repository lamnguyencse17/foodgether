import {
  CartItem,
  createOrderSchema,
  getMemberCurrentOrderSchema,
} from "../schemas/order";
import { auditOrder } from "../service/audit";
import { protectedProcedure } from "../trpc/trpc";
import {
  createOrder as createDbOrder,
  getExistingOrder,
  updateOrder,
} from "../db/order";
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
      getExistingOrder(
        ctx.prisma,
        input.invitationId,
        input.restaurantId,
        ctx.session.user.id
      ),
      getOptionDictOfInvitation(ctx.prisma, input.invitationId),
    ]);
    if (!order || !invitation) {
      return [] as CartItem[];
    }
    const parsedCartData: CartItem[] = await Promise.all(
      order.orderDish.map(async (orderDish) => ({
        id: orderDish.id,
        dishId: orderDish.dishId,
        dishPrice: orderDish.dishPrice,
        totalPrice: orderDish.totalPrice,
        options: orderDish.orderDishOption.map((option) => {
          const mandatory = get(
            invitation.optionDict,
            `${orderDish.dishId}.${option.optionId}.isMandatory`,
            false
          );
          return mandatory
            ? {
                id: option.id,
                optionId: option.optionId,
                price: option.price,
                mandatory: true,
                value: {
                  id: option.orderDishOptionItem[0]!.id,
                  price: option.orderDishOptionItem[0]!.price,
                  optionItemId: option.orderDishOptionItem[0]!.optionItemId,
                },
              }
            : {
                id: option.id,
                optionId: option.optionId,
                price: option.price,
                mandatory: false,
                value: option.orderDishOptionItem.map((item) => ({
                  id: item.id,
                  price: item.price,
                  optionItemId: item.optionItemId,
                })),
              };
        }),
      }))
    );
    return parsedCartData;
  });
