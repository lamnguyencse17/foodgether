import { TRPCError } from "@trpc/server";
import camelcaseKeys from "camelcase-keys";
import { env } from "../../env/server.mjs";
import { errors } from "../common/constants";
import { upsertMenu } from "../db/menu";
import { upsertRestaurant } from "../db/restaurant";
import {
  doesRestaurantExistFromUrlSchema,
  fetchRestaurantFromIdSchema,
  fetchRestaurantFromUrlSchema,
} from "../schemas/restaurant";
import {
  fetchShopeeMenu,
  fetchShopeeRestaurantFromDeliveryId,
  fetchShopeeRestaurantFromId,
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
    const restaurantResponse = await fetchShopeeRestaurantFromDeliveryId(
      deliveryId
    );
    if (restaurantResponse.result !== "success") {
      console.log(restaurantResponse);
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
      console.log(menu);
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
      const response = await fetch(
        `${env.NEXTAUTH_URL}/api/revalidate?secret=${env.REVALIDATION_TOKEN}`,
        {
          method: "POST",
          body: JSON.stringify({ url: `/restaurant/${restaurantId}` }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status !== 200) {
        console.log(response);
      }
      return { ...completedRestaurant };
    } catch (err) {
      console.error(err);
      throw new TRPCError({
        message: errors.menu.UPSERT_MENU,
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  });

export const fetchRestaurantFromId = publicProcedure
  .input(fetchRestaurantFromIdSchema)
  .query(async ({ input }) => {
    const restaurantResponse = await fetchShopeeRestaurantFromId(input.id);
    if (restaurantResponse.result !== "success") {
      console.log(restaurantResponse);
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

    const menu = await fetchShopeeMenu(
      restaurantResponse.reply.delivery_detail.delivery_id
    );
    if (menu.result !== "success") {
      console.log(menu);
      throw new TRPCError({
        message: errors.shopee.SHOPEE_MENU_FETCH_FAILED,
        code: "INTERNAL_SERVER_ERROR",
      });
    }
    try {
      const completedRestaurant = await upsertMenu(
        menu.reply.menu_infos,
        input.id
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
