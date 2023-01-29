import axios from "axios";
import { get, group, mapValues, objectify } from "radash";
import { env } from "../../env/server.mjs";
import { DishWithPriceAndPhoto } from "../../types/dish.js";
import { createDbInvitation } from "../db/invitation";
import { getAllOptions } from "../db/option";
import { getAggregatedRestaurant } from "../db/restaurant";
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
    const [restaurant, options] = await Promise.all([
      getAggregatedRestaurant(input.restaurantId),
      getAllOptions(input.restaurantId),
    ]);
    const groupedDict = group(options, (option) => option.dishId);
    const optionDict = mapValues(groupedDict, (value) =>
      objectify(
        value || [],
        (option) => option.id,
        (option) => ({
          ...option,
          items: objectify(option.items, (optionItem) => optionItem.id),
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
    await revalidateInvitation(invitation.id);
    return invitation;
  });
