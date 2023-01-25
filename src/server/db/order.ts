import { CreateOrderParams } from "../schemas/order";
import { prisma } from "./client";

export const createOrder = (order: CreateOrderParams, userId: string) => {
  return prisma.order.create({
    data: {
      orderReference: {
        create: {
          restaurantId: order.restaurantId,
          invitationId: order.invitationId,
          orderedById: userId,
        },
      },
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
          orderDishReference: {
            create: {
              restaurantId: order.restaurantId,
              dishId: item.dishId,
            },
          },
          dish: {
            connect: {
              id: item.dishId,
            },
          },
          orderDishOption: {
            create: item.options.map((option) => ({
              orderDishOptionReference: {
                create: {
                  optionId: option.optionId,
                  dishId: item.dishId,
                  restaurantId: order.restaurantId,
                },
              },
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
                      orderDishOptionItemReference: {
                        create: {
                          optionItemId: option.value,
                          dishId: item.dishId,
                          restaurantId: order.restaurantId,
                        },
                      },
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
                      orderDishOptionItemReference: {
                        create: {
                          optionItemId: optionItem.id,
                          dishId: item.dishId,
                          restaurantId: order.restaurantId,
                        },
                      },
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
