import { protectedProcedure } from "../trpc/trpc";

export const getCurrentUser = protectedProcedure.query(({ ctx }) => {
  return ctx.prisma.user.findUnique({
    where: {
      id: ctx.session.user.id,
    },
  });
});
