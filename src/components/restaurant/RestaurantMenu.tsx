import {
  Box,
  Card,
  CardBody,
  Heading,
  HStack,
  Img,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { isEmpty } from "radash";
import { FunctionComponent } from "react";
import { AggregatedDishTypesWithStringDate } from "../../types/dishTypes";
import { useTranslation } from "next-i18next";
import RestaurantMenuItem from "./RestaurantMenuItem";

type RestaurantMenuProps = {
  dishTypes: AggregatedDishTypesWithStringDate[];
};

const RestaurantMenu: FunctionComponent<RestaurantMenuProps> = ({
  dishTypes,
}) => {
  return (
    <Box flex={1}>
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
                <VStack divider={<StackDivider />} spacing="2">
                  {dishType.dishes.map((dish) => (
                    <RestaurantMenuItem dish={dish} key={dish.id} />
                  ))}
                </VStack>
              </Box>
            ))}
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default RestaurantMenu;
