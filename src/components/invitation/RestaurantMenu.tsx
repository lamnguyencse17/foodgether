import {
  Box,
  Card,
  CardBody,
  Heading,
  Skeleton,
  StackDivider,
  VStack,
} from "@chakra-ui/react";
import { get, isEmpty } from "radash";
import { FunctionComponent, useContext } from "react";
import { Virtuoso } from "react-virtuoso";
import useStore from "../../hooks/store";
import { VirtuosoRefContext } from "../../pages/invitation/[id]";
import { DishWithPriceAndPhoto } from "../../types/dish";
import { AggregatedDishTypes } from "../../types/dishTypes";
import RestaurantMenuItem from "./RestaurantMenuItem";

type RestaurantMenuProps = {
  dishTypes: AggregatedDishTypes[];
  restaurantId: number;
};

const RestaurantMenu: FunctionComponent<RestaurantMenuProps> = ({
  dishTypes,
  restaurantId,
}) => {
  const { dishDict } = useStore((state) => ({
    dishDict: state.dishDict.data,
  }));
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
                itemContent={(id, dishType) => {
                  return (
                    <Box key={id} width="full" marginY="5">
                      <Heading
                        size="xs"
                        textTransform="uppercase"
                        mb="3"
                        id={id.toString()}
                      >
                        {dishType.name}
                      </Heading>
                      <VStack
                        divider={<StackDivider />}
                        justifyContent={["center", "center", "flex-start"]}
                        alignItems={["center", "center", "flex-start"]}
                        width="full"
                      >
                        {dishType.dishList.map((dishId) => {
                          const dish = get(dishDict, `dishes.${dishId}`);
                          return (
                            <Box width="100%" key={dishId} marginY="2">
                              <Skeleton
                                isLoaded={!!dish}
                                height="40"
                                fadeDuration={4}
                              >
                                <RestaurantMenuItem
                                  dish={
                                    get(
                                      dishDict,
                                      `dishes.${dishId}`,
                                      {}
                                    ) as DishWithPriceAndPhoto
                                  }
                                  restaurantId={restaurantId}
                                />
                              </Skeleton>
                            </Box>
                          );
                        })}
                      </VStack>
                    </Box>
                  );
                }}
              />
            </VStack>
          </CardBody>
        </Card>
      )}
    </Box>
  );
};

export default RestaurantMenu;
