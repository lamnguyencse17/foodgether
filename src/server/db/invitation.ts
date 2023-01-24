import { prisma } from "./client";

export const getAllInvitationIds = async () => {
  const idObjectList = await prisma.invitation.findMany({
    select: { id: true },
  });
  return idObjectList.map((idObject) => idObject.id);
};

export const getInvitation = async (id: string) => {
  const [invitation, orders] = await Promise.all([
    prisma.invitation.findUnique({
      where: {
        id,
      },
      include: {
        createdBy: {
          select: {
            name: true,
          },
        },
        restaurant: true,
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
  return { ...invitation, orders };
};
