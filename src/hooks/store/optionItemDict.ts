import { InvitationOptionItem } from "@prisma/client";
import produce from "immer";
import { StateCreator } from "zustand";
import { UseStoreType } from ".";

export type OptionItemDictOptionData = {
  restaurantId: number;
  optionItems: { [optionItemId: string]: InvitationOptionItem };
};

export type OptionItemDictStoreType = {
  data: {
    restaurantPage?: OptionItemDictOptionData;
    invitationPage?: OptionItemDictOptionData;
  };
  setOptionItemDictForInvitationPage: (
    restaurantId: number,
    value: { [optionItemId: string]: InvitationOptionItem },
  ) => void;
};

const optionItemDictStore: StateCreator<
  UseStoreType,
  [["zustand/devtools", never]],
  [],
  OptionItemDictStoreType
> = (set) => ({
  data: {
    invitationPage: undefined,
    restaurantPage: undefined,
  },
  setOptionItemDictForInvitationPage: (restaurantId, value) =>
    set(
      produce<UseStoreType>((state) => {
        state.optionItemDict.data.invitationPage = {
          restaurantId,
          optionItems: value,
        };
      }),
      false,
      "setOptionDictForInvitationPage",
    ),
});

export default optionItemDictStore;
