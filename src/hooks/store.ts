import { Session } from "next-auth";
import create from "zustand";
import { devtools } from "zustand/middleware";
import produce from "immer";

type SessionUser = Session["user"];
export type ToastKeyParam = "info" | "warning" | "success" | "error";
type ToastValueParams = {
  title?: string;
  description?: string;
};

export type UseStoreType = {
  user: {
    data?: SessionUser;
    setUser: (user: SessionUser) => void;
    resetUser: () => void;
  };
  toast: {
    info?: ToastValueParams;
    warning?: ToastValueParams;
    success?: ToastValueParams;
    error?: ToastValueParams;
    setToast: (key: ToastKeyParam, value?: ToastValueParams) => void;
  };
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
  }))
);

export default useStore;
