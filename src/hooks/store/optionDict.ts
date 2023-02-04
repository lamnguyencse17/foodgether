import {
  InvitationOption,
  InvitationOptionItem,
  Option,
  OptionItem,
} from "@prisma/client";
import produce from "immer";
import { StateCreator } from "zustand";
import { UseStoreType } from ".";

export type OptionDictOptionData = {
  [optionId: string]: Option & {
    items: {
      [itemId: string]: OptionItem;
    };
  };
};

export type InvitationOptionDictOptionItems = {
  [itemId: string]: InvitationOptionItem;
};

export type InvitationOptionDictOptions = InvitationOption & {
  invitationOptionItems: InvitationOptionDictOptionItems;
};

export type InvitationOptionDictOptionData = {
  [optionId: string]: InvitationOptionDictOptions;
};

export type InvitationOptionDictDishData = {
  [dishId: string]: InvitationOptionDictOptionData;
};

export type OptionDictDishData = {
  [dishId: string]: OptionDictOptionData;
};

export type OptionDictStoreType = {
  data?: {
    restaurantId: number;
    options: OptionDictDishData;
  };
  dataV2: {
    restaurantPage?: {
      restaurantId: number;
      options: OptionDictDishData;
    };
    invitationPage?: {
      restaurantId: number;
      options: InvitationOptionDictDishData;
    };
  };
  setOptionDict: (value: OptionDictStoreType["data"]) => void;
  setOptionDictForInvitationPage: (
    restaurantId: number,
    value: InvitationOptionDictDishData
  ) => void;
};

const optionDictStore: StateCreator<
  UseStoreType,
  [["zustand/devtools", never]],
  [],
  OptionDictStoreType
> = (set) => ({
  data: undefined,
  setOptionDict: (value) =>
    set(
      produce<UseStoreType>((state) => {
        state.optionDict.data = value;
      }),
      false,
      "setOptionDict"
    ),
  dataV2: {
    invitationPage: undefined,
    restaurantPage: undefined,
  },
  setOptionDictForInvitationPage: (restaurantId, value) =>
    set(
      produce<UseStoreType>((state) => {
        state.optionDict.dataV2.invitationPage = {
          restaurantId,
          options: value,
        };
      }),
      false,
      "setOptionDictForInvitationPage"
    ),
});

export default optionDictStore;
