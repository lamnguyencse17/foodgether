import { PrismaClient } from "@prisma/client";
import { ShopeeMenu } from "../../types/shopee";

export const upsertDishTypes = (
  prisma: PrismaClient,
  restaurantId: number,
  menu: ShopeeMenu[]
) => {
  return prisma.dishTypes.createMany({
    data: menu.map((dishType) => ({
      id: dishType.dish_type_id,
      name: dishType.dish_type_name,
      restaurantId,
    })),
  });
};
