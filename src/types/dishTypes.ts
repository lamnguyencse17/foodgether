import { DishTypes } from "@prisma/client";
import { MetaStringDate } from "./shared";

export type DishTypesWithStringDate = Omit<
  DishTypes,
  "createdAt" | "updatedAt"
> &
  MetaStringDate;
