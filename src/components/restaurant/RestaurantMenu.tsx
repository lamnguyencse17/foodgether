import { Box, Card, CardBody, Skeleton, StackDivider, VStack } from "@chakra-ui/react";
import { isEmpty } from "radash";
import { FunctionComponent } from "react";

import { AggregatedDishTypes } from "../../types/dishTypes";
import RestaurantDishTypes from "./RestaurantDishTypes";

type RestaurantMenuProps = {
  dishTypes: AggregatedDishTypes[];
  restaurantId: number;
};

const RestaurantMenu: FunctionComponent<RestaurantMenuProps> = ({ dishTypes, restaurantId }) => {
  return (
    <Box flex={[null, null, 1]} maxW="full" width="100%">
      {isEmpty(dishTypes) ? (
        <Skeleton height="20" />
      ) : (
        <Card width="full">
          <CardBody width="full">
            <VStack divider={<StackDivider />}>
              {dishTypes.map((dishType) => (
                <RestaurantDishTypes
                  dishType={dishType}
                  dishTypeId={dishType.id}
                  restaurantId={restaurantId}
                  key={dishType.id}
                />
              ))}
            </VStack>
          </CardBody>
        </Card>
      )}
    </Box>
  );
};

export default RestaurantMenu;
