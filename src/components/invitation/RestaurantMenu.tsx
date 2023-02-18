import {
  Box,
  Card,
  CardBody,
  Skeleton,
  StackDivider,
  VStack,
} from "@chakra-ui/react";
import { InvitationDishTypes } from "@prisma/client";
import { isEmpty } from "radash";
import { FunctionComponent, useCallback, useContext } from "react";
import { Virtuoso } from "react-virtuoso";
import { VirtuosoRefContext } from "../../pages/invitation/[id]";
import RestaurantDishTypes from "./RestaurantDishTypes";

type RestaurantMenuProps = {
  dishTypes: InvitationDishTypes[];
  restaurantId: number;
  dishList: {
    [dishTypeId: string]: number[];
  };
};

const RestaurantMenu: FunctionComponent<RestaurantMenuProps> = ({
  dishTypes,
  restaurantId,
  dishList,
}) => {
  const virtuosoRef = useContext(VirtuosoRefContext);
  const itemRenderer = useCallback(
    (id: number, dishType: InvitationDishTypes) => (
      <RestaurantDishTypes
        dishType={dishType}
        dishTypeId={dishType.id}
        restaurantId={restaurantId}
        dishList={dishList}
      />
    ),
    [dishTypes.length]
  );
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
                style={{ width: "100%" }}
                itemContent={itemRenderer}
              />
            </VStack>
          </CardBody>
        </Card>
      )}
    </Box>
  );
};

export default RestaurantMenu;
