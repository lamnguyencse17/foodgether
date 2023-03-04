import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "./client";
import { formatISO, sub } from "date-fns";

export const createInvitationTx = (prisma: Prisma.TransactionClient, userId: string) => {
  return prisma.invitation.create({
    data: {
      createdBy: { connect: { id: userId } },
      restaurant: Prisma.JsonNull,
      optionDict: Prisma.JsonNull,
      dishDict: Prisma.JsonNull,
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
  return prisma.invitation.findUnique({
    where: {
      id,
    },
    include: {
      invitationRestaurant: true,
      orders: {
        include: {
          orderedBy: {
            select: {
              name: true,
              email: true,
              id: true,
            },
          },
          orderDishes: {
            include: {
              orderDishOptions: {
                include: {
                  orderDishOptionItems: {
                    include: {
                      invitationOptionItem: true,
                    },
                  },
                },
              },
              invitationDish: true,
            },
          },
        },
      },
    },
  });
};

export const getInvitationForMember = async (invitationId: string) => {
  return prisma.invitation.findUnique({
    where: {
      id: invitationId,
    },
    include: {
      invitationRestaurant: {
        include: {
          invitationOptions: {
            include: {
              invitationOptionItems: {
                distinct: "id",
              },
            },
          },
          invitationDishTypes: {
            include: {
              invitationDishTypeAndDishes: true,
            },
          },
          invitationDishes: {
            include: {
              invitationDishOptions: true,
            },
          },
        },
      },
      createdBy: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });
};

export const getOptionDictOfInvitation = async (prisma: PrismaClient, invitationId: string) => {
  return prisma.invitation.findUnique({
    where: { id: invitationId },
    select: { optionDict: true },
  });
};
