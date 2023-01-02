import type { DishTypes, Restaurant } from "@prisma/client";
import { DishWithStringDate } from "./dish";
import { DishTypesWithStringDate } from "./dishTypes";
import { MetaStringDate, Photo } from "./shared";

export type RestaurantWithStringDate = Omit<
  Restaurant,
  "createdAt" | "updatedAt" | "photos"
> &
  MetaStringDate & {
    photos: Photo[];
  };

export type AggregatedRestaurant =
  | (Restaurant & {
      photos: Photo[];
    } & {
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
