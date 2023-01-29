import { PrismaClient } from "@prisma/client";
import { ShopeeMenu } from "../../types/shopee";

export const upsertDishTypes = (
  prisma: PrismaClient,
  restaurantId: number,
  menu: ShopeeMenu[]
) => {
  // prisma.dishTypes.update({
  //   where: {
  //     id_restaurantId: {
  //       id: 1,
  //       restaurantId,
  //     }
  //   },
  //   data: {
  //     dishTypeAndDishes: {
  //       deleteMany: {
  //         dishTypeId: {
  //           notIn: menu.map((dishType) => dishType.dish_type_id)
  //         }
  //       },
  //     }
  //   }
  // })
  return prisma.dishTypes.createMany({
    data: menu.map((dishType) => ({
      id: dishType.dish_type_id,
      name: dishType.dish_type_name,
      restaurantId,
    })),
  });
};
