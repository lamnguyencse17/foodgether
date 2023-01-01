import { Session } from "next-auth";
import create from "zustand";
import { devtools } from "zustand/middleware";
import produce from "immer";

type SessionUser = Session["user"];

export type UseStoreType = {
  user: {
    data?: SessionUser;
    setUser: (user: SessionUser) => void;
    resetUser: () => void;
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
  }))
);

export default useStore;
