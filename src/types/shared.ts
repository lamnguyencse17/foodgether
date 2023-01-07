import { Dish, DishTypes, Restaurant } from "@prisma/client";

export type MetaStringDate = {
  createdAt: string;
  updatedAt: string;
};

export type SharedPropsFromServer = {
  locale: string;
  locales: string[];
  defaultLocale: string;
};

export type Photo = {
  value: string;
  width: number;
  height: number;
};

export type Price = {
  text: string;
  unit: string;
  value: number;
};
