import type { DishTypes, Restaurant } from "@prisma/client";

export type AggregatedRestaurant =
  | (Restaurant & {
      dishTypes: (DishTypes & {
        dishes: DishTypes[];
      })[];
    })
  | null;
