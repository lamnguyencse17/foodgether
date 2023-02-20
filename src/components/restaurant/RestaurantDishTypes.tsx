import { Box, Heading, StackDivider, VStack } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { AggregatedDishTypes } from "../../types/dishTypes";
import RestaurantDishWrapper from "./RestaurantDishWrapper";

type RestaurantDishTypesProps = {
  dishTypeId: number;
  dishType: AggregatedDishTypes;
  restaurantId: number;
};

const RestaurantDishTypes: FunctionComponent<RestaurantDishTypesProps> = ({
  dishTypeId,
  dishType,
  restaurantId,
}) => {
  return (
    <Box key={dishTypeId} width="full" marginY="5">
      <Heading size="xs" textTransform="uppercase" mb="3" id={dishTypeId.toString()}>
        {dishType.name}
      </Heading>
      <VStack
        divider={<StackDivider />}
        justifyContent={["center", "center", "flex-start"]}
        alignItems={["center", "center", "flex-start"]}
        width="full"
      >
        {dishType.dishList.map((dishId) => (
          <RestaurantDishWrapper dishId={dishId} restaurantId={restaurantId} key={dishId} />
        ))}
      </VStack>
    </Box>
  );
};

export default RestaurantDishTypes;
