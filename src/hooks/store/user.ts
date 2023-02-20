import produce from "immer";
import { Session } from "next-auth";
import { StateCreator } from "zustand";
import { UseStoreType } from ".";

type SessionUser = Session["user"];

export type UserStoreType = {
  data?: SessionUser;
  setUser: (user: SessionUser) => void;
  resetUser: () => void;
};

const userStore: StateCreator<UseStoreType, [["zustand/devtools", never]], [], UserStoreType> = (
  set,
) => ({
  data: undefined,
  setUser: (sessionUser: SessionUser) =>
    set(
      produce((state) => {
        state.user.data = sessionUser;
      }),
      false,
      "setUser",
    ),
  resetUser: () =>
    set(
      produce<UseStoreType>((state) => {
        state.user.data = undefined;
      }),
      false,
      "resetUser",
    ),
});

export default userStore;
