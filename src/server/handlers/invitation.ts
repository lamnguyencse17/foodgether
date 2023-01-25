import axios from "axios";
import { env } from "../../env/server.mjs";
import { createInvitationSchema } from "../schemas/invitation";
import { protectedProcedure } from "../trpc/trpc";

const revalidateInvitation = async (invitationId: string) => {
  const response = await axios.post(
    `${env.REVALIDATE_URL}?secret=${env.REVALIDATION_TOKEN}`,
    { url: `/invitation/${invitationId}/` },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  // if (response.status !== 200) {
  //   console.log(errors.menu.UPSERT_MENU, response);
  // }
};

export const createInvitation = protectedProcedure
  .input(createInvitationSchema)
  .mutation(async ({ ctx, input }) => {
    const invitation = await ctx.prisma.invitation.create({
      data: {
        createdBy: {
          connect: {
            id: ctx.session.user.id,
          },
        },
        restaurant: {
          connect: {
            id: input.restaurantId,
          },
        },
        invitationReference: {
          create: {
            restaurantId: input.restaurantId,
            createdById: ctx.session.user.id,
          },
        },
      },
    });
    await revalidateInvitation(invitation.id);
    return invitation;
  });
