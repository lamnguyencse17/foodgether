import { router } from "../trpc";
import { createOrder, getMemberCurrentOrder } from "../../handlers/order";

const orderRouter = router({
  createOrder,
  getMemberCurrentOrder,
});

export default orderRouter;
