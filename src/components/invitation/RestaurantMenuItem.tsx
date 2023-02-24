import {
  Box,
  Button,
  Card,
  CardBody,
  IconButton,
  Img,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { get, isEmpty } from "radash";
import { FunctionComponent, useContext } from "react";
import { InvitationDishWithPriceAndPhoto } from "../../types/dish";
import { AddIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import { Photo } from "../../types/shared";
import { CurrentOptionModalContext } from "./RestaurantMenu";

type RestaurantMenuItemProps = {
  dish?: InvitationDishWithPriceAndPhoto;
};

const RestaurantMenuItem: FunctionComponent<RestaurantMenuItemProps> = ({ dish }) => {
  const { t } = useTranslation();
  const { setCurrentOptionModal } = useContext(CurrentOptionModalContext);
  const photo = get(dish, "photos[0]", {}) as Photo | undefined;
  const dishId = dish?.id || -1;

  const showOption = () => {
    setCurrentOptionModal(dishId);
  };

  if (!dish) {
    return null;
  }
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
              src={photo?.value}
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
                <Text>{t("common.price_number", { val: dish.price?.value })}</Text>
              ) : (
                <Text as="s">{t("common.price_number", { val: dish.price?.value })}</Text>
              )}
              {!isEmpty(dish.discountPrice) && (
                <Text textColor="blue.400" fontWeight="bold">
                  {t("common.price_number", { val: dish.discountPrice?.value })}
                </Text>
              )}
            </VStack>
            <IconButton aria-label={dish.name} icon={<AddIcon />} size="sm" onClick={showOption} />
          </Stack>
        </CardBody>
      </Card>
    </>
  );
};

export default RestaurantMenuItem;
