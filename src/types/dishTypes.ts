import { DishTypes } from "@prisma/client";

export type AggregatedDishTypes = DishTypes & {
  dishList: number[];
};
