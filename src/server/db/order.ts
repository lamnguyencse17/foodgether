import { CreateOrderParams } from "../schemas/order";
import { prisma } from "./client";

export const createOrder = (order: CreateOrderParams, userId: string) => {
  return prisma.order.create({
    data: {
      restaurant: {
        connect: {
          id: order.restaurantId,
        },
      },
      orderedBy: {
        connect: {
          id: userId,
        },
      },
      invitation: {
        connect: {
          id: order.invitationId,
        },
      },
      orderDish: {
        create: order.items.map((item) => ({
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
                    restaurantId: order.restaurantId,
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
                            restaurantId: order.restaurantId,
                          },
                        },
                      },
                      price: option.price,
                    }
                  : option.value.map((optionItem) => ({
                      optionItem: {
                        connect: {
                          id_dishId_restaurantId: {
                            id: optionItem.id,
                            dishId: item.dishId,
                            restaurantId: order.restaurantId,
                          },
                        },
                      },
                      price: optionItem.price,
                    })),
              },
              price: option.price,
            })),
          },
          dishPrice: item.dishPrice,
          totalPrice: item.totalPrice,
        })),
      },
    },
  });
};
