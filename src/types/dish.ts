import { Dish } from "@prisma/client";
import { MetaStringDate, Photo, Price } from "./shared";

export type DishWithStringDate = Omit<
  Dish,
  "createdAt" | "updatedAt" | "photos" | "price" | "discountPrice"
> &
  MetaStringDate & { photos: Photo[] } & { price: Price } & {
    discountPrice: Price | null;
  };
