import type { DishTypes, Restaurant } from "@prisma/client";
import { DishWithStringDate } from "./dish";
import { DishTypesWithStringDate } from "./dishTypes";
import { MetaStringDate } from "./shared";

export type RestaurantWithStringDate = Omit<
  Restaurant,
  "createdAt" | "updatedAt"
> &
  MetaStringDate;

export type AggregatedRestaurant =
  | (Restaurant & {
      dishTypes: (DishTypes & {
        dishes: DishTypes[];
      })[];
    })
  | null;

export type AggregatedRestaurantWithStringDate =
  | (RestaurantWithStringDate & {
      dishTypes: (DishTypesWithStringDate & {
        dishes: DishWithStringDate[];
      })[];
    })
  | null;
