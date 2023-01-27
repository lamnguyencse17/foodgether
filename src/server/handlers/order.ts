import {
  createOrderSchema,
  getMemberCurrentOrderSchema,
} from "../schemas/order";
import { auditOrder } from "../service/audit";
import { protectedProcedure } from "../trpc/trpc";
import { createOrder as createDbOrder } from "../db/order";

export const createOrder = protectedProcedure
  .input(createOrderSchema)
  .mutation(async ({ ctx, input }) => {
    await auditOrder(input);
    return createDbOrder(input, ctx.session.user.id);
  });

export const getMemberCurrentOrder = protectedProcedure
  .input(getMemberCurrentOrderSchema)
  .query(async ({ ctx, input }) => {
    return ctx.prisma.order.findUnique({
      where: {
        orderedById_restaurantId_invitationId: {
          orderedById: ctx.session.user.id,
          ...input,
        },
      },
      include: {
        orderDish: {
          include: {
            orderDishOption: {
              include: {
                orderDishOptionItem: true,
              },
            },
          },
        },
      },
    });
  });
