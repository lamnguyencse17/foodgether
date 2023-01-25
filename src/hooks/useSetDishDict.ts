import { isEmpty, objectify } from "radash";
import { useEffect } from "react";
import { AggregatedRestaurant } from "../types/restaurant";
import useStore from "./store";

const useSetDishDict = (restaurant?: AggregatedRestaurant) => {
  const confirmedRestaurant = (restaurant ||
    {}) as NonNullable<AggregatedRestaurant>;
  const { data: dishDict, setDishDict } = useStore((state) => state.dishDict);
  const mismatchedRestaurant =
    confirmedRestaurant &&
    isEmpty(dishDict) &&
    dishDict?.restaurantId !== confirmedRestaurant.id;

  const setWhenEmptyDishDict =
    isEmpty(dishDict) && !isEmpty(confirmedRestaurant);

  useEffect(() => {
    if (setWhenEmptyDishDict || mismatchedRestaurant) {
      console.log({
        id: confirmedRestaurant.id,
        setWhenEmptyDishDict,
        mismatchedRestaurant,
        dishDict,
      });
      setDishDict({
        restaurantId: confirmedRestaurant.id,
        dishes: objectify(
          (confirmedRestaurant.dishTypes || []).flatMap(
            (dishType) => dishType.dishes
          ),
          (item) => item.id
        ),
      });
    }
  }, [setWhenEmptyDishDict, mismatchedRestaurant]);
};

export default useSetDishDict;
