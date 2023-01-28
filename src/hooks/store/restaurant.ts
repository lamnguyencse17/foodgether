import produce from "immer";
import { StateCreator } from "zustand";
import { UseStoreType } from ".";
import { AggregatedRestaurant } from "../../types/restaurant";

export type RestaurantStoreType = {
  data?: AggregatedRestaurant;
  setRestaurant: (value: AggregatedRestaurant) => void;
};

const restaurantStore: StateCreator<
  UseStoreType,
  [["zustand/devtools", never]],
  [],
  RestaurantStoreType
> = (set) => ({
  data: undefined,
  setRestaurant: (restaurant) =>
    set(
      produce((state) => {
        state.restaurant.data = restaurant;
      }),
      false,
      "setRestaurant"
    ),
});

export default restaurantStore;
