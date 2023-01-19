import { createOrderSchema } from "../schemas/order";
import { protectedProcedure } from "../trpc/trpc";

export const createOrder = protectedProcedure
  .input(createOrderSchema)
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.order.create({
      data: {
        restaurant: {
          connect: {
            id: input.restaurantId,
          },
        },
        orderedBy: {
          connect: {
            id: ctx.session.user.id,
          },
        },
        invitation: {
          connect: {
            id: input.invitationId,
          },
        },
        orderDish: {
          create: input.items.map((item) => ({
            dish: {
              connect: {
                id: item.dishId,
              },
            },
            orderDishOption: {
              create: item.options.map((option) => ({
                option: {
                  connect: {
                    id_dishId_restaurantId: {
                      id: option.optionId,
                      dishId: item.dishId,
                      restaurantId: input.restaurantId,
                    },
                  },
                },
                orderDishOptionItem: {
                  create: option.mandatory
                    ? {
                        optionItem: {
                          connect: {
                            id_dishId_restaurantId: {
                              id: option.value,
                              dishId: item.dishId,
                              restaurantId: input.restaurantId,
                            },
                          },
                        },
                      }
                    : option.value.map((value) => ({
                        optionItem: {
                          connect: {
                            id_dishId_restaurantId: {
                              id: value,
                              dishId: item.dishId,
                              restaurantId: input.restaurantId,
                            },
                          },
                        },
                      })),
                },
              })),
            },
          })),
        },
      },
    });
  });
