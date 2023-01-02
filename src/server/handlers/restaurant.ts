import camelcaseKeys from "camelcase-keys";
import { RestaurantIdResponse } from "../../types/shopee";
import { upsertMenu } from "../db/menu";
import { upsertRestaurant } from "../db/restaurant";
import {
  doesRestaurantExistFromUrlSchema,
  fetchRestaurantFromUrlSchema,
} from "../schemas/restaurant";
import {
  fetchShopeeMenu,
  fetchShopeeRestaurant,
  fetchShopeeRestaurantId,
} from "../service/shopee";
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

export const fetchRestaurantFromUrl = publicProcedure
  .input(fetchRestaurantFromUrlSchema)
  .query(async ({ ctx, input }) => {
    const restaurantIdResponse = await fetchShopeeRestaurantId(input.url);
    const {
      reply: { deliveryId, restaurantId },
    } = camelcaseKeys(restaurantIdResponse, { deep: true });
    const restaurantResponse = await fetchShopeeRestaurant(deliveryId);
    await upsertRestaurant(restaurantResponse.reply.delivery_detail);
    const menu = await fetchShopeeMenu(deliveryId);
    const completedRestaurant = await upsertMenu(
      menu.reply.menu_infos,
      restaurantId
    );
    return { ...completedRestaurant };
  });
