import { router } from "../trpc";
import {
  createOrder,
  getMemberCurrentOrder,
  editOrder,
} from "../../handlers/order";

const orderRouter = router({
  createOrder,
  getMemberCurrentOrder,
  editOrder,
});

export default orderRouter;
