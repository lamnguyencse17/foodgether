import { group, mapValues, objectify } from "radash";
import {
  getInvitationOptionFromDishIdSchema,
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

export const getInvitationOptionFromDishId = publicProcedure
  .input(getInvitationOptionFromDishIdSchema)
  .query(({ ctx, input }) => {
    return ctx.prisma.invitationOption.findMany({
      where: {
        invitationRestaurantId: input.restaurantId,
        id: input.invitationDishId,
      },
      include: {
        invitationOptionItems: true,
      },
    });
  });

export const getOptionForAllDishFromRestaurantId = publicProcedure
  .input(getOptionForAllDishSchema)
  .query(async ({ ctx, input }) => {
    const [dishOptions, options] = await Promise.all([
      ctx.prisma.dishOption.findMany({
        where: {
          restaurantId: input.restaurantId,
        },
      }),
      ctx.prisma.option.findMany({
        where: {
          restaurantId: input.restaurantId,
        },
        include: {
          items: true,
        },
      }),
    ]);
    const dishGroups = group(dishOptions, (dishOption) => dishOption.dishId);
    const optionItemDict = objectify(options, (option) => option.id);
    const optionDict = mapValues(dishGroups, (value) =>
      objectify(
        value || [],
        (dishOption) => dishOption.optionId,
        (dishOption) => {
          const option = optionItemDict[dishOption.optionId];
          return {
            ...option,
            items: objectify(optionItemDict[dishOption.optionId]?.items || [], (item) => item.id),
          };
        },
      ),
    );
    return optionDict;
  });

export const getOptionDictFromRestaurantId = publicProcedure
  .input(getOptionForAllDishSchema)
  .query(async ({ ctx, input }) => {
    const options = await Promise.all([
      ctx.prisma.dishOption.findMany({
        where: {
          restaurantId: input.restaurantId,
        },
        include: {
          option: true,
        },
      }),
      ctx.prisma.option.findMany({
        where: {
          restaurantId: input.restaurantId,
        },
      }),
    ]);
    console.log(options);
  });
