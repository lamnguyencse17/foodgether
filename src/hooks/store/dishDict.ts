import produce from "immer";
import { StateCreator } from "zustand";
import { UseStoreType } from ".";
import { DishWithPriceAndPhoto } from "../../types/dish";

export type DishDictStoreType = {
  data?: {
    restaurantId: number;
    dishes: {
      [dishId: string]: DishWithPriceAndPhoto;
    };
  };
  setDishDict: (value: DishDictStoreType["data"]) => void;
};

const dishDictStore: StateCreator<
  UseStoreType,
  [["zustand/devtools", never]],
  [],
  DishDictStoreType
> = (set) => ({
  data: undefined,
  setDishDict: (value) =>
    set(
      produce((state) => {
        state.dishDict.data = value;
      }),
      false,
      "setDishDict"
    ),
});

export default dishDictStore;
