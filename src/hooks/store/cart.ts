import produce from "immer";
import { replaceOrAppend } from "radash";
import { StateCreator } from "zustand";
import { UseStoreType } from ".";
import { CartItem } from "../../server/schemas/order";

export type CartStoreType = {
  data: CartItem[];
  addToCart: (cart: CartItem) => void;
  setCart: (cartItems: CartItem[]) => void;
  editCartItem: (cartItem: CartItem) => void;
};

const cartStore: StateCreator<
  UseStoreType,
  [["zustand/devtools", never]],
  [],
  CartStoreType
> = (set) => ({
  data: [],
  addToCart: (cartItem) =>
    set(
      produce((state) => {
        state.cart.data = [...state.cart.data, cartItem];
      }),
      false,
      "addToCart"
    ),
  editCartItem: (cartItem) =>
    set(
      produce((state) => {
        state.cart.data = replaceOrAppend(
          state.cart.data,
          cartItem,
          (item) => item.id === cartItem.id
        );
      }),
      false,
      "editCartItem"
    ),
  setCart: (cartItems) =>
    set(
      produce((state) => {
        state.cart.data = cartItems;
      }),
      false,
      "setCart"
    ),
});

export default cartStore;
