import { isEmpty } from "radash";
import { ShopeeDish } from "../../types/shopee";
import { prisma } from "./client";
import { Prisma } from "@prisma/client";

export const upsertDish = (restaurantId: number, dishList: ShopeeDish[]) => {
  return prisma.dish.createMany({
    data: dishList.map((dish) => ({
      id: dish.id,
      name: dish.name,
      description: dish.description,
      isAvailable: dish.is_available,
      isActive: dish.is_active,
      price: {
        text: dish.price.text,
        value: dish.price.value,
        unit: dish.price.unit,
      },
      photos: dish.photos.map((photo) => ({
        height: photo.height,
        width: photo.width,
        value: photo.value,
      })),
      discountPrice: isEmpty(dish.discount_price)
        ? Prisma.JsonNull
        : {
            text: dish.discount_price.text,
            value: dish.discount_price.value,
            unit: dish.discount_price.unit,
          },
      restaurantId,
    })),
  });
};

export const getDishPrice = (dishIds: number[], restaurantId: number) => {
  return prisma.dish.findMany({
    where: {
      AND: [
        {
          id: {
            in: dishIds,
          },
        },
        {
          restaurantId: restaurantId,
        },
      ],
    },
    select: {
      price: true,
      id: true,
    },
  });
};
