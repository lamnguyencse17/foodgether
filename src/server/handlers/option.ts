import { getOptionFromDishIdSchema } from "../schemas/option";
import { publicProcedure } from "../trpc/trpc";

export const getOptionFromDishId = publicProcedure
  .input(getOptionFromDishIdSchema)
  .query(({ ctx, input }) => {
    return ctx.prisma.option.findMany({
      where: {
        ...input,
      },
      include: {
        items: true,
      },
    });
  });
