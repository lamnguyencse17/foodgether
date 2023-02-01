import { get, group, mapValues, objectify } from "radash";
import { DishWithPriceAndPhoto } from "../../types/dish.js";
import { createDbInvitation } from "../db/invitation";
import { getAllOptions } from "../db/option";
import { getAggregatedRestaurant } from "../db/restaurant";
import { createInvitationSchema } from "../schemas/invitation";
import { protectedProcedure } from "../trpc/trpc";

export const createInvitation = protectedProcedure
  .input(createInvitationSchema)
  .mutation(async ({ ctx, input }) => {
    const [restaurant, options] = await Promise.all([
      getAggregatedRestaurant(ctx.prisma, input.restaurantId),
      getAllOptions(input.restaurantId),
    ]);
    const groupedDict = group(options || [], (option) => option.dishId);
    const optionDict = mapValues(groupedDict, (value) =>
      objectify(
        value || [],
        (dishOption) => dishOption.optionId,
        (dishOption) => ({
          ...dishOption.option,
          items: objectify(
            dishOption.option.items,
            (optionItem) => optionItem.id
          ),
        })
      )
    );
    //TODO: should fetch restaurant on not existed
    const dishDict = objectify(
      get(restaurant, "dishes", []) as DishWithPriceAndPhoto[],
      (item) => item.id
    );
    const invitation = await createDbInvitation(
      input.restaurantId,
      ctx.session.user.id,
      restaurant,
      dishDict,
      optionDict
    );
    return invitation;
  });
