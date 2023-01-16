import { createInvitationSchema } from "../schemas/invitation";
import { protectedProcedure } from "../trpc/trpc";

export const createInvitation = protectedProcedure
  .input(createInvitationSchema)
  .mutation(({ ctx, input }) => {
    return ctx.prisma.invitation.create({
      data: {
        ...input,
        createdById: ctx.session.user.id,
      },
    });
  });
