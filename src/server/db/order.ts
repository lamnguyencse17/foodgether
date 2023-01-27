import { PrismaClient } from "@prisma/client";
import { CreateOrderParams } from "../schemas/order";
import { prisma } from "./client";

export const updateOrder = async (order: CreateOrderParams, userId: string) => {
  await prisma.order.delete({
    where: {
      orderedById_restaurantId_invitationId: {
        orderedById: userId,
        restaurantId: order.restaurantId,
        invitationId: order.invitationId,
      },
    },
  });
  return createOrder(order, userId);
};

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
      User: {
        connect: {
          id: userId,
        },
      },
      orderDish: {
        create: order.items.map((item) => ({
          id: item.id,
          dishId: item.dishId,
          restaurantId: order.restaurantId,
          orderDishOption: {
            create: item.options.map((option) => ({
              id: option.id,
              optionId: option.optionId,
              dishId: item.dishId,
              restaurantId: order.restaurantId,
              orderDishOptionItem: {
                create: option.mandatory
                  ? {
                      optionItemId: option.value.optionItemId,
                      dishId: item.dishId,
                      restaurantId: order.restaurantId,
                      price: option.value.price,
                      id: option.value.id,
                    }
                  : option.value.map((optionItem) => ({
                      optionItemId: optionItem.optionItemId,
                      dishId: item.dishId,
                      restaurantId: order.restaurantId,
                      price: optionItem.price,
                      id: optionItem.id,
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

export const getExistingOrder = async (
  prisma: PrismaClient,
  invitationId: string,
  restaurantId: number,
  userId: string
) => {
  return prisma.order.findUnique({
    where: {
      orderedById_restaurantId_invitationId: {
        orderedById: userId,
        restaurantId,
        invitationId,
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
};
