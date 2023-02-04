import { Invitation } from "@prisma/client";
import { AggregatedInvitationRestaurant } from "./restaurant";

export type AggregatedInvitation = Omit<
  Invitation,
  "invitationRestaurant" | "dishDict" | "optionDict"
> & {
  invitationRestaurant: AggregatedInvitationRestaurant;
  // dishDict: Record<number, DishWithPriceAndPhoto>;
  // optionDict: OptionDictDishData;
};
