import { CreateOrderParams } from "../schemas/order";
import { prisma } from "./client";

export const createOrder = (order: CreateOrderParams, userId: string) => {
  return prisma.order.create({
    data: {
      restaurantId: order.restaurantId,
      orderedById: userId,
      invitation: {
        connect: {
          id: order.invitationId,
        },
      },
      orderDish: {
        create: order.items.map((item) => ({
          dishId: item.dishId,
          restaurantId: order.restaurantId,
          orderDishOption: {
            create: item.options.map((option) => ({
              optionId: option.optionId,
              dishId: item.dishId,
              restaurantId: order.restaurantId,
              orderDishOptionItem: {
                create: option.mandatory
                  ? {
                      optionItemId: option.value,
                      dishId: item.dishId,
                      restaurantId: order.restaurantId,
                      price: option.price,
                    }
                  : option.value.map((optionItem) => ({
                      optionItemId: optionItem.id,
                      dishId: item.dishId,
                      restaurantId: order.restaurantId,
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
