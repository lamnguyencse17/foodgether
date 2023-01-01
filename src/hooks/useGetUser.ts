import { useSession } from "next-auth/react";
import { isEmpty } from "radash";
import { useEffect } from "react";
import useStore from "./store";

const useGetUser = () => {
  const { data: sessionData } = useSession();
  const setUser = useStore((state) => state.setUser);

  const user = sessionData?.user;
  useEffect(() => {
    if (isEmpty(user)) return;
    setUser(user);
  }, [user]);
};

export default useGetUser;
