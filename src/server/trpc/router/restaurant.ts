import { router } from "../trpc";
import {
  doesRestaurantExistFromUrl,
  fetchRestaurantFromUrl,
} from "../../handlers/restaurant";

const restaurantRouter = router({
  doesRestaurantExistFromUrl,
  fetchRestaurantFromUrl,
});

export default restaurantRouter;
