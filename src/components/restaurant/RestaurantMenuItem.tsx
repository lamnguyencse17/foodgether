import {
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  Img,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { isEmpty } from "radash";
import { FunctionComponent } from "react";
import { DishWithStringDate } from "../../types/dish";
import { trpc } from "../../utils/trpc";
import { useTranslation } from "react-i18next";
import ItemOptionModal from "./ItemOptionModal";

type RestaurantMenuItemProps = {
  dish: DishWithStringDate;
  restaurantId: number;
};

const RestaurantMenuItem: FunctionComponent<RestaurantMenuItemProps> = ({
  dish,
  restaurantId,
}) => {
  const photo = dish.photos[0];
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { t } = useTranslation();

  const dishOptionQuery = trpc.option.getOptionFromDishId.useQuery(
    {
      dishId: dish.id,
      restaurantId,
    },
    { enabled: isOpen, staleTime: 60 * 1000 }
  );

  const showOption = () => {
    onOpen();
  };

  return (
    <>
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
              <Button variant="link" onClick={showOption}>
                <Text fontWeight="semibold">{dish.name}</Text>
              </Button>
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

      <ItemOptionModal
        isOpen={isOpen}
        onClose={onClose}
        dish={dish}
        options={dishOptionQuery.data}
      />
    </>
  );
};

export default RestaurantMenuItem;
