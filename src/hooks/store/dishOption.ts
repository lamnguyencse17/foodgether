import produce from "immer";
import { StateCreator } from "zustand";
import { UseStoreType } from ".";
import { DishOptionValue } from "../../server/schemas/order";

export type DishOptionStoreType = {
  data: {
    [optionItemId: number]: DishOptionValue;
  };
  setDishOption: (value: DishOptionValue) => void;
  resetDishOption: () => void;
};

const dishOptionStore: StateCreator<
  UseStoreType,
  [["zustand/devtools", never]],
  [],
  DishOptionStoreType
> = (set) => ({
  data: {},
  setDishOption: (value) =>
    set(
      produce((state) => {
        state.currentDishOption.data[value.optionId] = value;
      }),
      false,
      "setDishOption",
    ),
  resetDishOption: () =>
    set(
      produce<UseStoreType>((state) => {
        state.currentDishOption.data = {};
      }),
      false,
      "resetDishOption",
    ),
});

export default dishOptionStore;
