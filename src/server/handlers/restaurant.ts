import { doesRestaurantExistFromUrlSchema } from "../schemas/restaurant";
import { publicProcedure } from "../trpc/trpc";

export const doesRestaurantExistFromUrl = publicProcedure
  .input(doesRestaurantExistFromUrlSchema)
  .query(({ ctx, input }) => {
    return ctx.prisma.restaurant.findUnique({
      where: {
        ...input,
      },
      select: {
        id: true,
        url: true,
      },
    });
  });
