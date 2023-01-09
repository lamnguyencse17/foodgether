import { getOptionFromDishId } from "../../handlers/option";
import { router } from "../trpc";

const optionRouter = router({
  getOptionFromDishId,
});

export default optionRouter;
