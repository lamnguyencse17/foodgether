import { Invitation } from "@prisma/client";
import { AggregatedRestaurantWithStringDate } from "./restaurant";

export type InvitationWithStringDate = Omit<
  Invitation,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

export type AggregatedInvitationWithStringDate = InvitationWithStringDate & {
  restaurant: AggregatedRestaurantWithStringDate;
};
