import {
  getOptionFromDishId,
  getOptionForAllDishFromRestaurantId,
  getInvitationOptionFromDishId,
} from "../../handlers/option";
import { router } from "../trpc";

const optionRouter = router({
  getOptionFromDishId,
  getOptionForAllDishFromRestaurantId,
  getInvitationOptionFromDishId,
});

export default optionRouter;
