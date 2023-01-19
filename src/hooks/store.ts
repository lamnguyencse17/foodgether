import { Session } from "next-auth";
import create from "zustand";
import { devtools } from "zustand/middleware";
import produce from "immer";
import { replaceOrAppend } from "radash";
import { CartItem, DishOptionValue } from "../server/schemas/order";

type SessionUser = Session["user"];
export type ToastKeyParam = "info" | "warning" | "success" | "error";
type ToastValueParams = {
  title?: string;
  description?: string;
};

type UserStoreType = {
  data?: SessionUser;
  setUser: (user: SessionUser) => void;
  resetUser: () => void;
};

type DishOptionStoreType = {
  data: DishOptionValue[];
  setDishOption: (value: DishOptionValue) => void;
  resetDishOption: () => void;
};

type ToastStoreType = {
  info?: ToastValueParams;
  warning?: ToastValueParams;
  success?: ToastValueParams;
  error?: ToastValueParams;
  setToast: (key: ToastKeyParam, value?: ToastValueParams) => void;
};

type CartStoreType = {
  data: CartItem[];
  addToCart: (cart: CartItem) => void;
};

export type UseStoreType = {
  user: UserStoreType;
  toast: ToastStoreType;
  currentDishOption: DishOptionStoreType;
  cart: CartStoreType;
};

const useStore = create<UseStoreType>()(
  devtools((set) => ({
    user: {
      data: undefined,
      setUser: (sessionUser: SessionUser) =>
        set(
          produce((state) => {
            state.user.data = sessionUser;
          }),
          false,
          "setUser"
        ),
      resetUser: () =>
        set(
          produce((state) => {
            state.user.data = undefined;
          }),
          false,
          "resetUser"
        ),
    },
    toast: {
      setToast: (key: ToastKeyParam, value?: ToastValueParams) =>
        set(
          produce((state) => {
            state.toast[key] = value;
          }),
          false,
          "setToast"
        ),
    },
    currentDishOption: {
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
    },
    cart: {
      data: [],
      addToCart: (cartItem) =>
        set(
          produce((state) => {
            state.cart.data = [...state.cart.data, cartItem];
          }),
          false,
          "addToCart"
        ),
    },
  }))
);

export default useStore;
