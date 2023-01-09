import { router } from "../trpc";
import { authRouter } from "./auth";
import optionRouter from "./option";
import restaurantRouter from "./restaurant";
import userRouter from "./user";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  restaurant: restaurantRouter,
  option: optionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
