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
    priceRange: {
      minPrice: number;
      maxPrice: number;
    };
  };

export type AggregatedRestaurant =
  | (Restaurant & {
      photos: Photo[];
      priceRange: {
        minPrice: number;
        maxPrice: number;
      };
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
