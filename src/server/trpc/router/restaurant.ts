import { router } from "../trpc";
import {
  doesRestaurantExistFromUrl,
  fetchRestaurantFromUrl,
  fetchRestaurantFromId,
} from "../../handlers/restaurant";

const restaurantRouter = router({
  doesRestaurantExistFromUrl,
  fetchRestaurantFromUrl,
  fetchRestaurantFromId,
});

export default restaurantRouter;
