import { ShopeeMenu } from "../../types/shopee";
import { prisma } from "./client";

export const upsertDishTypeAndDishes = (
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
