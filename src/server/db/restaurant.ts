import { Prisma } from "@prisma/client";
import { ShopeeRestaurant } from "../../types/shopee";
import { prisma } from "./client";

export const upsertRestaurant = async (restaurant: ShopeeRestaurant) => {
  const upsertData = {
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
  };
  return prisma.restaurant.upsert({
    where: {
      id: restaurant.restaurant_id,
    },
    create: {
      id: restaurant.restaurant_id,
      ...upsertData,
    },
    update: upsertData,
  });
};

export const getAggregatedRestaurant = async (restaurantId: number) => {
  const rawRestaurant = await prisma.restaurant.findUnique({
    where: {
      id: restaurantId,
    },
    include: {
      dishTypes: {
        include: {
          dishTypeAndDishes: {
            include: {
              dish: true,
            },
          },
        },
        orderBy: {
          displayOrder: "asc",
        },
      },
    },
  });

  return {
    ...rawRestaurant,
    dishTypes: rawRestaurant?.dishTypes.map((dishType) => ({
      ...dishType,
      dishes: dishType.dishTypeAndDishes.map((dish) => dish.dish),
    })),
  };
};
