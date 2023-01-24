import type { DishTypes, Restaurant } from "@prisma/client";
import { Photo } from "./shared";

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

export type RestaurantWithPhotoAndPrice = Restaurant & {
  photos: Photo[];
  priceRange: {
    minPrice: number;
    maxPrice: number;
  };
};
