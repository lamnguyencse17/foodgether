import { InvitationOption, InvitationOptionItem, Prisma } from "@prisma/client";
import { listify } from "radash";
import {
  InvitationOptionDictOptionData,
  OptionDictOptionData,
} from "../hooks/store/optionDict";

export const listifyOptions = (options: OptionDictOptionData) => {
  return listify(options, (_, value) => {
    return {
      ...value,
      items: listify(value.items, (_, value) => ({ ...value })),
    };
  });
};

export const listifyInvitationOptions = (
  options?: InvitationOptionDictOptionData
): (InvitationOption & {
  invitationOptionItems: InvitationOptionItem[];
})[] => {
  if (!options) {
    return [];
  }
  return listify(options, (_, value) => {
    return {
      ...value,
      invitationOptionItems: listify(
        value.invitationOptionItems,
        (_, value) => ({ ...value })
      ),
    };
  });
};

export const complyWithJson = (data: any): Prisma.InputJsonValue => {
  return !data ? Prisma.JsonNull : JSON.parse(JSON.stringify(data));
};
