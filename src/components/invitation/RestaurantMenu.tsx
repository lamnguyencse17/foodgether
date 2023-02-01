import {
  Box,
  Card,
  CardBody,
  Skeleton,
  StackDivider,
  VStack,
} from "@chakra-ui/react";
import { isEmpty } from "radash";
import { FunctionComponent, useContext } from "react";
import { Virtuoso } from "react-virtuoso";
import { VirtuosoRefContext } from "../../pages/invitation/[id]";
import { AggregatedDishTypes } from "../../types/dishTypes";
import RestaurantDishTypes from "./RestaurantDishTypes";

type RestaurantMenuProps = {
  dishTypes: AggregatedDishTypes[];
  restaurantId: number;
};

const RestaurantMenu: FunctionComponent<RestaurantMenuProps> = ({
  dishTypes,
  restaurantId,
}) => {
  const virtuosoRef = useContext(VirtuosoRefContext);
  return (
    <Box flex={[null, null, 1]} maxW="full" width="100%">
      {isEmpty(dishTypes) ? (
        <Skeleton height="20" />
      ) : (
        <Card width="full">
          <CardBody width="full">
            <VStack divider={<StackDivider />}>
              <Virtuoso
                ref={virtuosoRef}
                initialItemCount={2}
                useWindowScroll
                data={dishTypes}
                computeItemKey={(_, item) => item.id}
                style={{ width: "100%" }}
                itemContent={(id, dishType) => (
                  <RestaurantDishTypes
                    dishType={dishType}
                    dishTypeId={id}
                    restaurantId={restaurantId}
                  />
                )}
              />
            </VStack>
          </CardBody>
        </Card>
      )}
    </Box>
  );
};

export default RestaurantMenu;
