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
