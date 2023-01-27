import { Dish, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { errors } from "../common/constants";
import { prisma } from "./client";
import { getAggregatedRestaurant } from "./restaurant";
import type { OptionDictDishData } from "../../hooks/store";
import { formatISO, sub } from "date-fns";

export const createDbInvitation = async (
  restaurantId: number,
  userId: string,
  restaurant: Awaited<ReturnType<typeof getAggregatedRestaurant>>,
  dishDict: Record<number, Dish>,
  optionDict: OptionDictDishData
) => {
  return prisma.invitation.create({
    data: {
      restaurantId,
      createdById: userId,
      restaurant: JSON.parse(JSON.stringify(restaurant)),
      optionDict: JSON.parse(JSON.stringify(optionDict)),
      dishDict: JSON.parse(JSON.stringify(dishDict)),
    },
  });
};

export const getAllInvitationIds = async () => {
  const idObjectList = await prisma.invitation.findMany({
    select: { id: true },
  });
  return idObjectList.map((idObject) => idObject.id);
};

export const getAllRecentInvitationIds = async () => {
  const idObjectList = await prisma.invitation.findMany({
    select: { id: true },
    where: {
      createdAt: {
        gte: formatISO(sub(new Date(), { days: 1 })),
      },
    },
  });
  return idObjectList.map((idObject) => idObject.id);
};

export const getInvitationForCreator = async (id: string) => {
  const [invitation, orders] = await Promise.all([
    prisma.invitation.findUnique({
      where: {
        id,
      },
    }),
    prisma.order.findMany({
      where: {
        invitationId: id,
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
    }),
  ]);
  if (!invitation) {
    throw new TRPCError({
      message: errors.invitation.ERROR_WHILE_GETTING_INVITATION,
      code: "INTERNAL_SERVER_ERROR",
    });
  }
  const [restaurant, creator] = await Promise.all([
    prisma.restaurant.findUnique({
      where: {
        id: invitation.restaurantId,
      },
    }),
    prisma.user.findUnique({
      where: {
        id: invitation.createdById,
      },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);
  return { ...invitation, orders, restaurant, creator };
};

export const getOptionDictOfInvitation = async (
  prisma: PrismaClient,
  invitationId: string
) => {
  return prisma.invitation.findUnique({
    where: { id: invitationId },
    select: { optionDict: true },
  });
};
