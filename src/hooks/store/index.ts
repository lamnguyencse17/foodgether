import { create } from "zustand";
import { devtools } from "zustand/middleware";
import userStore, { UserStoreType } from "./user";
import toastStore, { ToastStoreType } from "./toast";
import dishOptionStore, { DishOptionStoreType } from "./dishOption";
import cartStore, { CartStoreType } from "./cart";
import optionDictStore, { OptionDictStoreType } from "./optionDict";
import dishDictStore, { DishDictStoreType } from "./dishDict";
import restaurantStore, { RestaurantStoreType } from "./restaurant";

export type UseStoreType = {
  user: UserStoreType;
  toast: ToastStoreType;
  currentDishOption: DishOptionStoreType;
  cart: CartStoreType;
  optionDict: OptionDictStoreType;
  dishDict: DishDictStoreType;
  restaurant: RestaurantStoreType;
};

const useStore = create<UseStoreType>()(
  devtools((...methods) => ({
    user: userStore(...methods),
    toast: toastStore(...methods),
    currentDishOption: dishOptionStore(...methods),
    cart: cartStore(...methods),
    optionDict: optionDictStore(...methods),
    dishDict: dishDictStore(...methods),
    restaurant: restaurantStore(...methods),
  }))
);

export default useStore;
