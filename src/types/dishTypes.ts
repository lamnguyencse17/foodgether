import { DishTypes } from "@prisma/client";
import { DishWithPriceAndPhoto } from "./dish";

export type AggregatedDishTypes = DishTypes & {
  dishes: DishWithPriceAndPhoto[];
};
