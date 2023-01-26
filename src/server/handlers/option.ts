import { getAllOptions } from "../db/option";
import {
  getOptionForAllDishSchema,
  getOptionFromDishIdSchema,
} from "../schemas/option";
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

export const getOptionForAllDishFromRestaurantId = publicProcedure
  .input(getOptionForAllDishSchema)
  .query(({ input }) => {
    return getAllOptions(input.restaurantId);
  });
