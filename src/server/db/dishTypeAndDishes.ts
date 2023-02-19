import { ShopeeMenu } from "../../types/shopee";
import { Prisma, PrismaClient } from "@prisma/client";

export const upsertDishTypeAndDishes = (
  prisma: Prisma.TransactionClient | PrismaClient,
  restaurantId: number,
  menu: ShopeeMenu[]
) => {
  return prisma.dishTypeAndDishes.createMany({
    data: menu.flatMap((dishType) => {
      return dishType.dishes.map((dish) => ({
        dishId: dish.id,
        dishTypeId: dishType.dish_type_id,
        restaurantId,
      }));
    }),
  });
};
