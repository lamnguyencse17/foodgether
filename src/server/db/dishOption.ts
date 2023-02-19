import { Prisma, PrismaClient } from "@prisma/client";
import { ShopeeOption } from "../../types/shopee";

export const upsertDishOption = (
  prisma: PrismaClient | Prisma.TransactionClient,
  restaurantId: number,
  optionList: (ShopeeOption & { dishId: number })[]
) => {
  return prisma.dishOption.createMany({
    data: optionList.map((option) => ({
      dishId: option.dishId,
      optionId: option.id,
      restaurantId,
    })),
  });
};
