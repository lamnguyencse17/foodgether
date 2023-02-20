import produce from "immer";
import { StateCreator } from "zustand";
import { UseStoreType } from ".";
import { AggregatedInvitationRestaurant, AggregatedRestaurant } from "../../types/restaurant";

export type RestaurantStoreType = {
  data?: AggregatedRestaurant;
  dataV2: {
    restaurantPage?: AggregatedRestaurant;
    invitationPage?: AggregatedInvitationRestaurant;
  };
  setRestaurant: (value: AggregatedRestaurant) => void;
  setRestaurantForInvitationPage: (value: AggregatedInvitationRestaurant) => void;
};

const restaurantStore: StateCreator<
  UseStoreType,
  [["zustand/devtools", never]],
  [],
  RestaurantStoreType
> = (set) => ({
  data: undefined,
  dataV2: {
    invitationPage: undefined,
    restaurantPage: undefined,
  },
  setRestaurant: (restaurant) =>
    set(
      produce<UseStoreType>((state) => {
        state.restaurant.data = restaurant;
      }),
      false,
      "setRestaurant",
    ),
  setRestaurantForInvitationPage: (restaurant) =>
    set(
      produce<UseStoreType>((state) => {
        state.restaurant.dataV2.invitationPage = restaurant;
      }),
      false,
      "setRestaurantForInvitationPage",
    ),
});

export default restaurantStore;
