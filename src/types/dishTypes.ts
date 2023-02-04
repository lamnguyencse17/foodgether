import { DishTypes, InvitationDishTypes } from "@prisma/client";

export type AggregatedDishTypes = DishTypes & {
  dishList: number[];
};

export type AggregatedInvitationDishTypes = InvitationDishTypes & {
  dishList: number[];
};
