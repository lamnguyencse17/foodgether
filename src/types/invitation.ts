import { Invitation } from "@prisma/client";
import { AggregatedRestaurant } from "./restaurant";

export type AggregatedInvitation = Invitation & {
  restaurant: AggregatedRestaurant;
};
