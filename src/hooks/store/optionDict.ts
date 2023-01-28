import { Option, OptionItem } from "@prisma/client";
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

export type OptionDictDishData = {
  [dishId: string]: OptionDictOptionData;
};

export type OptionDictStoreType = {
  data?: {
    restaurantId: number;
    options: OptionDictDishData;
  };
  setOptionDict: (value: OptionDictStoreType["data"]) => void;
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
      produce((state) => {
        state.optionDict.data = value;
      }),
      false,
      "setOptionDict"
    ),
});

export default optionDictStore;
