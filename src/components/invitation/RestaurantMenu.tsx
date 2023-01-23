import {
  Box,
  Card,
  CardBody,
  Heading,
  Skeleton,
  StackDivider,
  VStack,
} from "@chakra-ui/react";
import { isEmpty } from "radash";
import { FunctionComponent } from "react";
import { AggregatedDishTypesWithStringDate } from "../../types/dishTypes";
import RestaurantMenuItem from "./RestaurantMenuItem";

type RestaurantMenuProps = {
  dishTypes: AggregatedDishTypesWithStringDate[];
  restaurantId: number;
};

const RestaurantMenu: FunctionComponent<RestaurantMenuProps> = ({
  dishTypes,
  restaurantId,
}) => {
  return (
    <Box flex={[null, null, 1]} maxW="full">
      {isEmpty(dishTypes) ? (
        <Skeleton height="20" />
      ) : (
        <Card>
          <CardBody>
            <VStack divider={<StackDivider />} spacing="4">
              {dishTypes.map((dishType) => (
                <Box key={dishType.id} width="full">
                  <Heading
                    size="xs"
                    textTransform="uppercase"
                    mb="3"
                    id={dishType.id.toString()}
                  >
                    {dishType.name}
                  </Heading>
                  <VStack
                    divider={<StackDivider />}
                    spacing="2"
                    justifyContent={["center", "center", "flex-start"]}
                    alignItems={["center", "center", "flex-start"]}
                  >
                    {dishType.dishes.map((dish) => (
                      <RestaurantMenuItem
                        dish={dish}
                        key={dish.id}
                        restaurantId={restaurantId}
                      />
                    ))}
                  </VStack>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      )}
    </Box>
  );
};

export default RestaurantMenu;
