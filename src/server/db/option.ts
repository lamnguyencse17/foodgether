import { ShopeeOption } from "../../types/shopee";
import { prisma } from "./client";

export const upsertOption = (
  restaurantId: number,
  optionList: (ShopeeOption & { dishId: number })[]
) => {
  return prisma.option.createMany({
    data: optionList.map((option) => ({
      id: option.id,
      name: option.name,
      dishId: option.dishId,
      ntop: option.ntop,
      isMandatory: option.mandatory,
      maxQuantity: option.option_items.max_select,
      minQuantity: option.option_items.min_select,
      restaurantId,
    })),
  });
};

export const getAllOptions = (restaurantId: number) => {
  return prisma.option.findMany({
    where: {
      restaurantId: restaurantId,
    },
    include: {
      items: true,
    },
  });
};
