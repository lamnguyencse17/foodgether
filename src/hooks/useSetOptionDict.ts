import { isEmpty } from "radash";
import { useEffect } from "react";
import { AggregatedRestaurant } from "../types/restaurant";
import { trpc } from "../utils/trpc";
import useStore from "./store";
import { OptionDictDishData } from "./store/optionDict";

const useSetOptionDict = (isFetchingRestaurant: boolean, restaurant?: AggregatedRestaurant) => {
  const restaurantId = restaurant?.id || -1;
  const { data: optionDict, setOptionDict } = useStore((state) => state.optionDict);

  const haveCorrectOptionDict =
    !!optionDict && optionDict?.restaurantId === restaurantId && !isEmpty(optionDict.options);

  const shouldFetchOptionDict =
    !isEmpty(restaurant) && !haveCorrectOptionDict && !isFetchingRestaurant;

  const getOptionForAllDishesQuery = trpc.option.getOptionForAllDishFromRestaurantId.useQuery(
    {
      restaurantId: restaurantId,
    },
    {
      enabled: shouldFetchOptionDict,
      refetchOnWindowFocus: false,
    },
  );
  useEffect(() => {
    if (getOptionForAllDishesQuery.isFetched && !haveCorrectOptionDict) {
      setOptionDict({
        restaurantId: restaurantId || -1,
        options: (getOptionForAllDishesQuery.data || {}) as OptionDictDishData,
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
