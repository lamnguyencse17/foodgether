import { isEmpty, objectify } from "radash";
import { useEffect } from "react";
import { AggregatedRestaurant } from "../types/restaurant";
import useStore from "./store";

const useSetDishDict = (restaurant?: AggregatedRestaurant) => {
  const { data: dishDict, setDishDict } = useStore((state) => state.dishDict);
  const mismatchedRestaurant =
    restaurant && isEmpty(dishDict) && dishDict?.restaurantId !== restaurant.id;

  const setWhenEmptyDishDict = isEmpty(dishDict) && !isEmpty(restaurant);

  useEffect(() => {
    if ((restaurant && setWhenEmptyDishDict) || mismatchedRestaurant) {
      setDishDict({
        restaurantId: restaurant.id,
        dishes: objectify(restaurant.dishes, (item) => item.id),
      });
    }
  }, [setWhenEmptyDishDict, mismatchedRestaurant]);
};

export default useSetDishDict;
