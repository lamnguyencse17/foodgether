import produce from "immer";
import { StateCreator } from "zustand";
import { UseStoreType } from ".";
import {
  DishWithPriceAndPhoto,
  InvitationDishWithPriceAndPhoto,
} from "../../types/dish";

export type DishDictStoreType = {
  data?: {
    restaurantId: number;
    dishes: {
      [dishId: string]: DishWithPriceAndPhoto;
    };
  };
  dataV2: {
    restaurantPage?: {
      restaurantId: number;
      dishes: {
        [dishId: string]: DishWithPriceAndPhoto;
      };
    };
    invitationPage?: {
      restaurantId: number;
      dishes: {
        [dishId: string]: InvitationDishWithPriceAndPhoto;
      };
    };
  };
  setDishDict: (value: DishDictStoreType["data"]) => void;
  setDishDictForInvitationPage: (
    restaurantId: number,
    value: {
      [dishId: string]: InvitationDishWithPriceAndPhoto;
    }
  ) => void;
};

const dishDictStore: StateCreator<
  UseStoreType,
  [["zustand/devtools", never]],
  [],
  DishDictStoreType
> = (set) => ({
  data: undefined,
  dataV2: {
    invitationPage: undefined,
    restaurantPage: undefined,
  },
  setDishDict: (value) =>
    set(
      produce<UseStoreType>((state) => {
        state.dishDict.data = value;
      }),
      false,
      "setDishDict"
    ),
  setDishDictForInvitationPage: (restaurantId, value) =>
    set(
      produce<UseStoreType>((state) => {
        state.dishDict.dataV2.invitationPage = { restaurantId, dishes: value };
      }),
      false,
      "setDishDictForInvitationPage"
    ),
});

export default dishDictStore;
