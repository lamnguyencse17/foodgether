import type { User } from "@prisma/client";
import { Session } from "next-auth";
import create from "zustand";
import { devtools } from "zustand/middleware";

type SessionUser = Session["user"];

type UseStoreType = {
  user?: SessionUser;
  setUser: (user: SessionUser) => void;
};

const useStore = create<UseStoreType>()(
  devtools((set) => ({
    user: undefined,
    setUser: (user: SessionUser) => set({ user }),
    resetUser: () => set({ user: undefined }),
  }))
);

export default useStore;
