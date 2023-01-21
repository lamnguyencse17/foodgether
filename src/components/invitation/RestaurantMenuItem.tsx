import {
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  IconButton,
  Img,
  Stack,
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
import { AddIcon } from "@chakra-ui/icons";

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
      <Card
        width="full"
        variant="outline"
        direction={["column", "column", "row"]}
        alignItems={["center", "center", "flex-start"]}
        justifyContent={["center", "center", "flex-start"]}
      >
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
          <Stack
            alignItems={["center", "center", "flex-start"]}
            justifyContent={["center", "center", "flex-start"]}
            direction={["column", "column", "row"]}
          >
            <Box flex={1}>
              <Button variant="link" onClick={showOption}>
                <Text fontWeight="semibold" fontSize={["md", "md", "lg"]}>
                  {dish.name}
                </Text>
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
            <IconButton
              aria-label={dish.name}
              icon={<AddIcon />}
              size="sm"
              onClick={showOption}
            />
          </Stack>
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
