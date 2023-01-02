import { Dish } from "@prisma/client";
import { MetaStringDate } from "./shared";

export type DishWithStringDate = Omit<Dish, "createdAt" | "updatedAt"> &
  MetaStringDate;
