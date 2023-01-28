import { Invitation } from "@prisma/client";
import { OptionDictDishData } from "../hooks/store/optionDict";
import { DishWithPriceAndPhoto } from "./dish";
import { AggregatedRestaurant } from "./restaurant";

export type AggregatedInvitation = Omit<
  Invitation,
  "restaurant" | "dishDict" | "optionDict"
> & {
  restaurant: AggregatedRestaurant;
  dishDict: Record<number, DishWithPriceAndPhoto>;
  optionDict: OptionDictDishData;
};
