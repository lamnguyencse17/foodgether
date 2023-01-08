import { ShopeeMenu } from "../../types/shopee";
import { prisma } from "./client";

export const upsertDishTypeAndDishes = async (
  restaurantId: number,
  menu: ShopeeMenu[]
) => {
  await prisma.dishTypeAndDishes.createMany({
    data: menu.flatMap((dishType) => {
      return dishType.dishes.map((dish) => ({
        dishId: dish.id,
        dishTypeId: dishType.dish_type_id,
        restaurantId,
      }));
    }),
  });
};
