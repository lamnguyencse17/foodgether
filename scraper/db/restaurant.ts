import { Restaurant } from "../scraper";
import prisma from "./prisma";
import { Prisma } from "@prisma/client";

export const upsertRestaurant = async (restaurant: Restaurant) => {
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

// export const getRestaurantFromId = async (id: string) => {
//   const restaurant = await prisma.restaurant.findUnique({
//     where: {
//       id,
//     },
//     include: {
//       menu: true,
//     },
//   });
//   if (!restaurant) {
//     return null;
//   }
//   return {
//     ...restaurant,
//     createdAt: dayjs(restaurant.createdAt).unix(),
//     updatedAt: dayjs(restaurant.updatedAt).unix(),
//     menu: {
//       ...restaurant.menu,
//       createdAt: dayjs(restaurant.menu?.createdAt).unix(),
//       updatedAt: dayjs(restaurant.menu?.updatedAt).unix(),
//     },
//   };
// };
