import { Prisma, PrismaClient } from "@prisma/client";
import { ShopeeOption } from "../../types/shopee";
import { prisma } from "./client";

export const upsertOption = (
  prisma: Prisma.TransactionClient | PrismaClient,
  restaurantId: number,
  optionList: (ShopeeOption & { dishId: number })[]
) => {
  return prisma.option.createMany({
    data: optionList.map((option) => ({
      id: option.id,
      name: option.name,
      ntop: option.ntop,
      isMandatory: option.mandatory,
      maxQuantity: option.option_items.max_select,
      minQuantity: option.option_items.min_select,
      restaurantId,
    })),
  });
};

export const getAllOptions = (restaurantId: number) => {
  return prisma.dishOption.findMany({
    where: {
      restaurantId,
    },
    include: {
      option: {
        include: {
          items: true,
        },
      },
    },
  });
};
