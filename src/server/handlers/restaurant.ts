import { TRPCError } from "@trpc/server";
import camelcaseKeys from "camelcase-keys";
import { errors } from "../common/constants";
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
  .query(async ({ input }) => {
    const restaurantIdResponse = await fetchShopeeRestaurantId(input.url);
    if (restaurantIdResponse.result !== "success") {
      throw new TRPCError({
        message: errors.shopee.SHOPEE_INTIAL_FETCH_FAILED,
        code: "INTERNAL_SERVER_ERROR",
      });
    }
    const {
      reply: { deliveryId, restaurantId },
    } = camelcaseKeys(restaurantIdResponse, { deep: true });
    const restaurantResponse = await fetchShopeeRestaurant(deliveryId);
    if (restaurantResponse.result !== "success") {
      throw new TRPCError({
        message: errors.shopee.SHOPEE_RESTAURANT_FETCH_FAILED,
        code: "INTERNAL_SERVER_ERROR",
      });
    }
    try {
      await upsertRestaurant(restaurantResponse.reply.delivery_detail);
    } catch (err) {
      console.error(err);
      throw new TRPCError({
        message: errors.restaurant.UPSERT_RESTAURANT,
        code: "INTERNAL_SERVER_ERROR",
      });
    }

    const menu = await fetchShopeeMenu(deliveryId);
    if (menu.result !== "success") {
      throw new TRPCError({
        message: errors.shopee.SHOPEE_MENU_FETCH_FAILED,
        code: "INTERNAL_SERVER_ERROR",
      });
    }
    try {
      const completedRestaurant = await upsertMenu(
        menu.reply.menu_infos,
        restaurantId
      );
      return { ...completedRestaurant };
    } catch (err) {
      console.error(err);
      throw new TRPCError({
        message: errors.menu.UPSERT_MENU,
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  });
