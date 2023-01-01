import { router } from "../trpc";
import { authRouter } from "./auth";
import restaurantRouter from "./restaurant";
import userRouter from "./user";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  restaurant: restaurantRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
