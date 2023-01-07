import { ShopeeMenu } from "../../types/shopee";
import { prisma } from "./client";

export const upsertDishTypes = async (
  restaurantId: number,
  menu: ShopeeMenu[]
) => {
  await prisma.dishTypes.deleteMany({
    where: {
      restaurantId,
    },
  });

  await prisma.dishTypes.createMany({
    data: menu.map((dishType) => ({
      id: dishType.dish_type_id,
      name: dishType.dish_type_name,
      restaurantId,
    })),
    skipDuplicates: true,
  });
};
