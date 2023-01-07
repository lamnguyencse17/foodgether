import {
  Box,
  Card,
  CardBody,
  HStack,
  Img,
  Text,
  VStack,
} from "@chakra-ui/react";
import { isEmpty } from "radash";
import { FunctionComponent } from "react";
import { DishWithStringDate } from "../../types/dish";

type RestaurantMenuItemProps = {
  dish: DishWithStringDate;
};

const RestaurantMenuItem: FunctionComponent<RestaurantMenuItemProps> = ({
  dish,
}) => {
  const photo = dish.photos[0];

  return (
    <Card width="full" variant="outline" direction="row">
      <Box maxH="40" maxW="40">
        {photo && (
          <Img
            boxSize="40"
            src={photo.value}
            alt={dish.name}
            style={{ objectFit: "scale-down" }}
            p={4}
            borderRadius="md"
          />
        )}
      </Box>

      <CardBody>
        <HStack alignItems="flex-start" justifyContent="flex-start">
          <Box flex={1}>
            <Text fontWeight="semibold">{dish.name}</Text>
            <Text fontSize="sm">{dish.description}</Text>
          </Box>
          <VStack alignItems="flex-start" justifyContent="flex-start">
            {isEmpty(dish.discountPrice) ? (
              <Text>{dish.price.text}</Text>
            ) : (
              <Text as="s">{dish.price.text}</Text>
            )}
            {!isEmpty(dish.discountPrice) && (
              <Text textColor="blue.400" fontWeight="bold">
                {dish.discountPrice?.text}
              </Text>
            )}
          </VStack>
        </HStack>
      </CardBody>
    </Card>
  );
};

export default RestaurantMenuItem;
