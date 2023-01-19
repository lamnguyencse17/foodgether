import { router } from "../trpc";
import { createOrder } from "../../handlers/order";

const orderRouter = router({
  createOrder,
});

export default orderRouter;
