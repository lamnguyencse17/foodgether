import { isEmpty, unique } from "radash";
import { prisma } from "./client";
import { Prisma } from "@prisma/client";
import { ShopeeMenu } from "../../types/shopee";

export const upsertMenu = async (menu: ShopeeMenu[], restaurantId: number) => {
  await prisma.dishTypes.deleteMany({
    where: {
      restaurantId,
    },
  });
  const allDishes = menu.flatMap((dishType) => dishType.dishes);
  const dishes = unique(allDishes, (dish) => dish.id);

  await prisma.dish.createMany({
    data: dishes.map((dish) => ({
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
    })),
  });

  await prisma.dishTypes.createMany({
    data: menu.map((dishType) => ({
      id: dishType.dish_type_id,
      name: dishType.dish_type_name,
      restaurantId,
    })),
  });

  await prisma.dishTypeAndDishes.createMany({
    data: menu.flatMap((dishType) => {
      return dishType.dishes.map((dish) => ({
        dishId: dish.id,
        dishTypeId: dishType.dish_type_id,
      }));
    }),
  });

  const rawRestaurant = await prisma.restaurant.findUnique({
    where: {
      id: restaurantId,
    },
    include: {
      dishTypes: {
        include: {
          dishTypeAndDishes: {
            include: {
              dish: true,
            },
          },
        },
      },
    },
  });

  return {
    ...rawRestaurant,
    dishTypes: rawRestaurant?.dishTypes.map((dishType) => ({
      ...dishType,
      dishes: dishType.dishTypeAndDishes.map((dish) => dish.dish),
    })),
  };
};
