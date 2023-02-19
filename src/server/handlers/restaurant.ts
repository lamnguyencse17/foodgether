import { Prisma, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import camelcaseKeys from "camelcase-keys";
import { unique } from "radash";
import { ShopeeMenu } from "../../types/shopee";
import { errors } from "../common/constants";
import { upsertDish } from "../db/dish";
import { upsertDishOption } from "../db/dishOption";
import { upsertDishTypeAndDishes } from "../db/dishTypeAndDishes";
import { upsertDishTypes } from "../db/dishTypes";
import { upsertOption } from "../db/option";
import { upsertOptionItem } from "../db/optionItem";
import { getAggregatedRestaurant, upsertRestaurant } from "../db/restaurant";
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

export const updateRestaurantMenu = async (
  prisma: PrismaClient | Prisma.TransactionClient,
  restaurantId: number,
  menu: ShopeeMenu[]
) => {
  const allDishes = menu.flatMap((dishType) => dishType.dishes);
  const dishList = unique(allDishes, (dish) => dish.id);
  const optionList = dishList.flatMap((dish) =>
    dish.options.map((config) => ({ ...config, dishId: dish.id }))
  );
  const optionItems = optionList.flatMap((option) =>
    option.option_items.items.map((item) => ({
      ...item,
      dishId: option.dishId,
      optionId: option.id,
    }))
  );

  // await prisma.$transaction([
  await upsertDish(prisma, restaurantId, dishList);
  await upsertDishTypes(prisma, restaurantId, menu);
  await upsertOption(
    prisma,
    restaurantId,
    unique(optionList, (option) => option.id)
  );
  await upsertDishOption(prisma, restaurantId, optionList);
  await upsertDishTypeAndDishes(prisma, restaurantId, menu);
  await upsertOptionItem(prisma, restaurantId, optionItems);
  // ]);

  return restaurantId;
};

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
      console.log(
        errors.shopee.SHOPEE_RESTAURANT_FETCH_FAILED,
        restaurantResponse
      );
      throw new TRPCError({
        message: errors.shopee.SHOPEE_RESTAURANT_FETCH_FAILED,
        code: "INTERNAL_SERVER_ERROR",
      });
    }
    return ctx.prisma.$transaction(
      async (tx) => {
        try {
          await upsertRestaurant(tx, restaurantResponse.reply.delivery_detail);
        } catch (err) {
          console.error(err);
          throw new TRPCError({
            message: errors.restaurant.UPSERT_RESTAURANT,
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        const menu = await fetchShopeeMenu(deliveryId);
        if (menu.result !== "success") {
          console.log(errors.shopee.SHOPEE_MENU_FETCH_FAILED, menu);
          throw new TRPCError({
            message: errors.shopee.SHOPEE_MENU_FETCH_FAILED,
            code: "INTERNAL_SERVER_ERROR",
          });
        }
        try {
          await updateRestaurantMenu(tx, restaurantId, menu.reply.menu_infos);

          return { id: restaurantId };
        } catch (err) {
          console.error(errors.menu.UPSERT_MENU, err);
          throw new TRPCError({
            message: errors.menu.UPSERT_MENU,
            code: "INTERNAL_SERVER_ERROR",
          });
        }
      },
      {
        timeout: 9000,
      }
    );
  });

export const fetchRestaurantFromId = publicProcedure
  .input(fetchRestaurantFromIdSchema)
  .query(async ({ ctx, input }) => {
    if (isNaN(input.id) || !input.id) {
      return {};
    }
    const restaurantResponse = await fetchShopeeRestaurantFromId(input.id);
    if (restaurantResponse.result !== "success") {
      console.log(
        errors.shopee.SHOPEE_RESTAURANT_FETCH_FAILED,
        restaurantResponse
      );
      throw new TRPCError({
        message: errors.shopee.SHOPEE_RESTAURANT_FETCH_FAILED,
        code: "INTERNAL_SERVER_ERROR",
      });
    }
    return ctx.prisma.$transaction(
      async (tx) => {
        try {
          await upsertRestaurant(tx, restaurantResponse.reply.delivery_detail);
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
          console.log(errors.shopee.SHOPEE_MENU_FETCH_FAILED, menu);
          throw new TRPCError({
            message: errors.shopee.SHOPEE_MENU_FETCH_FAILED,
            code: "INTERNAL_SERVER_ERROR",
          });
        }
        try {
          await updateRestaurantMenu(tx, input.id, menu.reply.menu_infos);
          const restaurant = await getAggregatedRestaurant(tx, input.id);
          return { ...restaurant };
        } catch (err) {
          console.error(errors.menu.UPSERT_MENU, err);
          throw new TRPCError({
            message: errors.menu.UPSERT_MENU,
            code: "INTERNAL_SERVER_ERROR",
          });
        }
      },
      {
        timeout: 9000,
      }
    );
  });
