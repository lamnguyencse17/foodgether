import { group, isEmpty, mapValues, objectify } from "radash";
import { useEffect } from "react";
import { AggregatedRestaurant } from "../types/restaurant";
import { trpc } from "../utils/trpc";
import useStore from "./store";

const useSetOptionDict = (
  isFetchingRestaurant: boolean,
  restaurant?: AggregatedRestaurant
) => {
  const restaurantId = restaurant?.id || -1;
  const { data: optionDict, setOptionDict } = useStore(
    (state) => state.optionDict
  );

  const haveCorrectOptionDict =
    !!optionDict &&
    optionDict?.restaurantId === restaurantId &&
    !isEmpty(optionDict.options);

  const shouldFetchOptionDict =
    !isEmpty(restaurant) &&
    // getRestaurantQuery.isFetched &&
    // isValidRestaurantId &&
    !haveCorrectOptionDict &&
    !isFetchingRestaurant;

  const getOptionForAllDishesQuery =
    trpc.option.getOptionForAllDishFromRestaurantId.useQuery(
      {
        restaurantId: restaurantId,
      },
      {
        enabled: shouldFetchOptionDict,
        refetchOnWindowFocus: false,
      }
    );
  useEffect(() => {
    if (getOptionForAllDishesQuery.isFetched && !haveCorrectOptionDict) {
      const groupedDict = group(
        getOptionForAllDishesQuery.data || [],
        (option) => option.dishId
      );
      const newOptionDict = mapValues(groupedDict, (value) =>
        objectify(
          value || [],
          (option) => option.id,
          (option) => ({
            ...option,
            items: objectify(option.items, (optionItem) => optionItem.id),
          })
        )
      );
      setOptionDict({
        restaurantId: restaurantId || -1,
        options: newOptionDict,
      });
    }
  }, [
    getOptionForAllDishesQuery.data,
    getOptionForAllDishesQuery.isFetched,
    haveCorrectOptionDict,
    restaurantId,
  ]);
};

export default useSetOptionDict;
