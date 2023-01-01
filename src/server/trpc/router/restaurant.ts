import { router } from "../trpc";
import { doesRestaurantExistFromUrl } from "../../handlers/restaurant";

const restaurantRouter = router({
  doesRestaurantExistFromUrl,
});

export default restaurantRouter;
