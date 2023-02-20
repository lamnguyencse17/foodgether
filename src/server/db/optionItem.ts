import { Prisma, PrismaClient } from "@prisma/client";
import { isEmpty } from "radash";
import { ShopeeItem } from "../../types/shopee";
import { prisma } from "./client";

export const upsertOptionItem = (
  prisma: Prisma.TransactionClient | PrismaClient,
  restaurantId: number,
  optionItemList: (ShopeeItem & { optionId: number; dishId: number })[],
) => {
  const createData = optionItemList.map((optionItem) => ({
    id: optionItem.id,
    name: optionItem.name,
    weight: optionItem.weight,
    price: isEmpty(optionItem.price)
      ? Prisma.JsonNull
      : {
          text: optionItem.price.text,
          value: optionItem.price.value,
          unit: optionItem.price.unit,
        },
    ntopPrice: isEmpty(optionItem.ntop_price)
      ? Prisma.JsonNull
      : {
          text: optionItem.ntop_price.text,
          value: optionItem.ntop_price.value,
          unit: optionItem.ntop_price.unit,
        },
    isDefault: optionItem.is_default,
    maxQuantity: optionItem.max_quantity,
    topOrder: optionItem.top_order,
    dishId: optionItem.dishId,
    optionId: optionItem.optionId,
    restaurantId,
  }));
  return prisma.optionItem.createMany({
    data: createData,
  });
};

export const getOptionItemPrice = (
  filterList: { id: number; restaurantId: number; dishId: number }[],
) => {
  return prisma.optionItem.findMany({
    where: {
      OR: filterList,
    },
    select: {
      price: true,
      id: true,
    },
  });
};
