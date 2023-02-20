import produce from "immer";
import { StateCreator } from "zustand";
import { UseStoreType } from ".";

export type ToastKeyParam = "info" | "warning" | "success" | "error";
type ToastValueParams = {
  title?: string;
  description?: string;
};

export type ToastStoreType = {
  info?: ToastValueParams;
  warning?: ToastValueParams;
  success?: ToastValueParams;
  error?: ToastValueParams;
  setToast: (key: ToastKeyParam, value?: ToastValueParams) => void;
};

const toastStore: StateCreator<UseStoreType, [["zustand/devtools", never]], [], ToastStoreType> = (
  set,
) => ({
  setToast: (key: ToastKeyParam, value?: ToastValueParams) =>
    set(
      produce<UseStoreType>((state) => {
        state.toast[key] = value;
      }),
      false,
      "setToast",
    ),
});

export default toastStore;
