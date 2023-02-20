import { Dish, InvitationDish } from "@prisma/client";
import { Photo, Price } from "./shared";

export type DishWithPriceAndPhoto = Omit<Dish, "photos" | "price" | "discountPrice"> & {
  photos: Photo[];
} & { price: Price } & {
  discountPrice: Price | null;
};

export type InvitationDishWithPriceAndPhoto = Omit<
  InvitationDish,
  "photos" | "price" | "discountPrice"
> & { photos: Photo[] } & { price: Price } & {
  discountPrice: Price | null;
};
