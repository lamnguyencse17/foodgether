import {
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  Img,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { isEmpty } from "radash";
import { FunctionComponent } from "react";
import { DishWithStringDate } from "../../types/dish";
import { trpc } from "../../utils/trpc";
import { useTranslation } from "next-i18next";

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
  const { t } = useTranslation("common");

  const dishOptionQuery = trpc.option.getOptionFromDishId.useQuery(
    {
      dishId: dish.id,
      restaurantId,
    },
    { enabled: isOpen, staleTime: 60 * 1000 }
  );

  console.log(dishOptionQuery.data);
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {dish.name} - {t("restaurant_page.option")}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>aaaa</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RestaurantMenuItem;
