import type {
  DishTypes,
  InvitationDishOption,
  InvitationDishTypeAndDishes,
  InvitationDishTypes,
  InvitationOption,
  InvitationOptionItem,
  InvitationRestaurant,
  Restaurant,
} from "@prisma/client";
import { DishWithPriceAndPhoto, InvitationDishWithPriceAndPhoto } from "./dish";
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

export type AggregatedInvitationRestaurant =
  | (InvitationRestaurant & {
      photos: Photo[];
      priceRange: {
        minPrice: number;
        maxPrice: number;
      };
    } & {
      invitationDishTypes: InvitationDishTypes[];
      invitationDishes: InvitationDishWithPriceAndPhoto[];
    })
  | null;

export type InvitationRestaurantWithPhotoAndPrice = InvitationRestaurant & {
  photos: Photo[];
  priceRange: {
    minPrice: number;
    maxPrice: number;
  };
};

export type RestaurantWithPhotoAndPrice = Restaurant & {
  photos: Photo[];
  priceRange: {
    minPrice: number;
    maxPrice: number;
  };
};

export type RestaurantInInvitation = InvitationRestaurant & {
  invitationOptions: (InvitationOption & {
    invitationOptionItems: InvitationOptionItem[];
  })[];
  invitationDishTypes: InvitationDishTypes[];
  invitationDishes: (InvitationDishWithPriceAndPhoto & {
    invitationDishOptions: InvitationDishOption[];
    invitationDishTypesAndDishes: InvitationDishTypeAndDishes[];
  })[];
} & {
  photos: Photo[];
  priceRange: {
    minPrice: number;
    maxPrice: number;
  };
};
