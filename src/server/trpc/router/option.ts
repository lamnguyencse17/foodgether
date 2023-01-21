import {
  getOptionFromDishId,
  getOptionForAllDishFromRestaurantId,
} from "../../handlers/option";
import { router } from "../trpc";

const optionRouter = router({
  getOptionFromDishId,
  getOptionForAllDishFromRestaurantId,
});

export default optionRouter;
