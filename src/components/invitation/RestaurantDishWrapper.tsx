import { Box, Skeleton } from "@chakra-ui/react";
import { get } from "radash";
import { FunctionComponent, useMemo } from "react";
import { shallow } from "zustand/shallow";
import useStore from "../../hooks/store";
import { InvitationDishWithPriceAndPhoto } from "../../types/dish";
import RestaurantMenuItem from "./RestaurantMenuItem";

type RestaurantDishWrapperProps = {
  dishId: number;
};

const RestaurantDishWrapper: FunctionComponent<RestaurantDishWrapperProps> = ({ dishId }) => {
  const { dishDict } = useStore(
    (state) => ({
      dishDict: state.dishDict.dataV2.invitationPage,
    }),
    shallow,
  );
  const dish = useMemo(() => get(dishDict, `dishes.${dishId}`), [dishDict, dishId]);
  return (
    <Box width="100%" marginY="2">
      <Skeleton isLoaded={!!dish} height="40" fadeDuration={0.5}>
        <RestaurantMenuItem dish={dish as InvitationDishWithPriceAndPhoto} />
      </Skeleton>
    </Box>
  );
};

export default RestaurantDishWrapper;
