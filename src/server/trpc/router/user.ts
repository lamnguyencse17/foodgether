import { router } from "../trpc";
import { getCurrentUser } from "../../handlers/user";

const userRouter = router({
  getCurrentUser,
});

export default userRouter;
