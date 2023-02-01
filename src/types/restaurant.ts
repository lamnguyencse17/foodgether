import type { DishTypes, Restaurant } from "@prisma/client";
import { DishWithPriceAndPhoto } from "./dish";
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
        dishList: number[];
      })[];
      dishes: DishWithPriceAndPhoto[];
    })
  | null;

export type RestaurantWithPhotoAndPrice = Restaurant & {
  photos: Photo[];
  priceRange: {
    minPrice: number;
    maxPrice: number;
  };
};
