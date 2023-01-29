import { Prisma, PrismaClient } from "@prisma/client";
import { omit } from "radash";
import { DishWithPriceAndPhoto } from "../../types/dish";
import { ShopeeRestaurant } from "../../types/shopee";

export const upsertRestaurant = async (
  prisma: PrismaClient,
  restaurant: ShopeeRestaurant
) => {
  return prisma.$transaction([
    prisma.restaurant.deleteMany({
      where: {
        id: restaurant.restaurant_id,
      },
    }),
    prisma.restaurant.create({
      data: {
        id: restaurant.restaurant_id,
        name: restaurant.name,
        url: restaurant.url,
        deliveryId: restaurant.delivery_id,
        address: restaurant.address,
        position: {
          latitude: restaurant.position.latitude,
          longitude: restaurant.position.longitude,
        },
        priceRange: {
          minPrice: restaurant.price_range.min_price,
          maxPrice: restaurant.price_range.max_price,
        },
        isQualityMerchant: restaurant.is_quality_merchant,
        photos: restaurant.photos as unknown as Prisma.JsonArray,
        isAvailable: restaurant.asap_is_available,
      },
    }),
  ]);
};

export const getAggregatedRestaurant = async (
  prisma: PrismaClient,
  restaurantId: number
) => {
  const rawRestaurant = await prisma.restaurant.findUnique({
    where: {
      id: restaurantId,
    },
    include: {
      dishTypes: {
        include: {
          dishTypeAndDishes: true,
        },
        orderBy: {
          displayOrder: "asc",
        },
      },
      dish: true,
    },
  });
  if (!rawRestaurant) {
    return null;
  }
  return {
    ...omit(rawRestaurant, ["dish"]),
    dishTypes: rawRestaurant?.dishTypes.map((dishType) => ({
      ...omit(dishType, ["dishTypeAndDishes"]),
      dishList: dishType.dishTypeAndDishes.map((dish) => dish.dishId),
    })),
    dishes: rawRestaurant.dish as DishWithPriceAndPhoto[],
  };
};
