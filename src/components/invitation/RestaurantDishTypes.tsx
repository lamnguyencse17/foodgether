import { Box, Heading, StackDivider, VStack } from "@chakra-ui/react";
import { InvitationDishTypes } from "@prisma/client";
import { FunctionComponent } from "react";
import RestaurantDishWrapper from "./RestaurantDishWrapper";

type RestaurantDishTypesProps = {
  dishTypeId: number;
  dishType: InvitationDishTypes;
  dishList: {
    [dishTypeId: string]: number[];
  };
};

const RestaurantDishTypes: FunctionComponent<RestaurantDishTypesProps> = ({
  dishTypeId,
  dishType,
  dishList,
}) => {
  const dishInDishTypes = dishList[dishTypeId];
  if (!dishInDishTypes) return null;
  return (
    <Box key={dishTypeId} width="full" marginY="5">
      <Heading
        size="xs"
        textTransform="uppercase"
        mb="3"
        id={dishTypeId.toString()}
      >
        {dishType.name}
      </Heading>
      <VStack
        divider={<StackDivider />}
        justifyContent={["center", "center", "flex-start"]}
        alignItems={["center", "center", "flex-start"]}
        width="full"
      >
        {dishInDishTypes.map((dishId) => (
          <RestaurantDishWrapper dishId={dishId} key={dishId} />
        ))}
      </VStack>
    </Box>
  );
};

export default RestaurantDishTypes;
