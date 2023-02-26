import { shallow } from "zustand/shallow";
import { useSession } from "next-auth/react";
import { isEmpty, shake } from "radash";
import { useEffect } from "react";
import useStore from "./store";
import * as Sentry from "@sentry/nextjs";

const useHandleAuthenticateUser = () => {
  const { data: sessionData, status } = useSession();
  const { data: user, setUser, resetUser } = useStore((state) => ({ ...state.user }), shallow);

  const sessionUser = sessionData?.user;

  useEffect(() => {
    if (status !== "authenticated" || !isEmpty(user)) return;
    if (!sessionUser) return;
    setUser(sessionUser);
    Sentry.setUser(shake(sessionUser, (property) => !property));
  }, [sessionUser, status, user, setUser]);

  useEffect(() => {
    if (status !== "authenticated" && !isEmpty(user)) resetUser();
  }, [user, sessionUser, status, resetUser]);
};

export default useHandleAuthenticateUser;
