import { DishTypes } from "@prisma/client";
import { DishWithStringDate } from "./dish";
import { MetaStringDate } from "./shared";

export type DishTypesWithStringDate = Omit<
  DishTypes,
  "createdAt" | "updatedAt"
> &
  MetaStringDate;

export type AggregatedDishTypesWithStringDate = Omit<
  DishTypesWithStringDate,
  "dishes"
> & {
  dishes: DishWithStringDate[];
};
