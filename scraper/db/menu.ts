import { isEmpty, unique } from "radash";
import { Menu } from "../scraper";
import prisma from "./prisma";
import { Prisma } from "@prisma/client";

export const upsertMenu = async (menu: Menu[], restaurantId: number) => {
  const allDishes = menu.flatMap((dishType) => dishType.dishes);
  const dishes = unique(allDishes, (dish) => dish.id);
  const createDishPromises = dishes.map((dish) => {
    const upsertData = {
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
    };
    return prisma.dish.upsert({
      where: {
        id: dish.id,
      },
      create: {
        id: dish.id,
        ...upsertData,
      },
      update: upsertData,
    });
  });
  const createdDish = await Promise.all(createDishPromises);
  await Promise.all(
    menu.map((dishType) => {
      const upsertData = {
        name: dishType.dish_type_name,
        dishes: {
          connect: createdDish.map((dish) => ({ id: dish.id })),
        },
        restaurant: {
          connect: {
            id: restaurantId,
          },
        },
      };
      return prisma.dishTypes.upsert({
        where: {
          id: dishType.dish_type_id,
        },
        create: {
          id: dishType.dish_type_id,
          ...upsertData,
        },
        update: upsertData,
      });
    })
  );
  return prisma.restaurant.findUnique({
    where: {
      id: restaurantId,
    },
    include: {
      dishTypes: {
        include: {
          dishes: true,
        },
      },
    },
  });
};
