import produce from "immer";
import { replaceOrAppend } from "radash";
import { StateCreator } from "zustand";
import { UseStoreType } from ".";
import { DishOptionValue } from "../../server/schemas/order";

export type DishOptionStoreType = {
  data: DishOptionValue[];
  setDishOption: (value: DishOptionValue) => void;
  resetDishOption: () => void;
};

const dishOptionStore: StateCreator<
  UseStoreType,
  [["zustand/devtools", never]],
  [],
  DishOptionStoreType
> = (set) => ({
  data: [],
  setDishOption: (value) =>
    set(
      produce((state) => {
        const newOptions = replaceOrAppend(
          state.currentDishOption.data || [],
          value,
          (filter) => filter.optionId === value.optionId
        );
        state.currentDishOption.data = newOptions;
      }),
      false,
      "setDishOption"
    ),
  resetDishOption: () =>
    set(
      produce((state) => {
        state.currentDishOption.data = [];
      }),
      false,
      "resetDishOption"
    ),
});

export default dishOptionStore;
