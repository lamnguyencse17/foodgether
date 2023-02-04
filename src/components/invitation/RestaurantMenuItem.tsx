import {
  Box,
  Button,
  Card,
  CardBody,
  IconButton,
  Img,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { get, isEmpty } from "radash";
import { FunctionComponent, useEffect } from "react";
import { InvitationDishWithPriceAndPhoto } from "../../types/dish";
import { trpc } from "../../utils/trpc";
import ItemOptionModal from "./ItemOptionModal";
import { AddIcon } from "@chakra-ui/icons";
import useStore from "../../hooks/store";
import { listifyInvitationOptions } from "../../utils/transform";
import { useTranslation } from "react-i18next";
import { Photo } from "../../types/shared";

type RestaurantMenuItemProps = {
  dish?: InvitationDishWithPriceAndPhoto;
  restaurantId: number;
};

const RestaurantMenuItem: FunctionComponent<RestaurantMenuItemProps> = ({
  dish,
  restaurantId,
}) => {
  const { t } = useTranslation();
  const optionDict = useStore(
    (state) => state.optionDict.dataV2.invitationPage
  );
  const options = optionDict?.options || {};
  const photo = get(dish, "photos[0]", {}) as Photo | undefined;
  const { onOpen, onClose, isOpen } = useDisclosure();
  const trpcContext = trpc.useContext();
  const dishId = dish?.id || -1;

  const dishOptionQuery = trpc.option.getInvitationOptionFromDishId.useQuery(
    {
      invitationDishId: dishId,
      restaurantId,
    },
    {
      enabled: isOpen && !options[dishId] && isEmpty(optionDict),
      staleTime: 60 * 1000,
    }
  );
  const option = options[dishId];
  const currentOption =
    (option && listifyInvitationOptions(option)) || dishOptionQuery.data;

  const showOption = () => {
    onOpen();
  };

  useEffect(() => {
    if (dishOptionQuery.isFetching && option) {
      trpcContext.option.getOptionFromDishId.cancel();
    }
  }, [
    dishOptionQuery.isFetching,
    option,
    trpcContext.option.getOptionFromDishId,
  ]);

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
                <Text>
                  {t("common.price_number", { val: dish.price?.value })}
                </Text>
              ) : (
                <Text as="s">
                  {t("common.price_number", { val: dish.price?.value })}
                </Text>
              )}
              {!isEmpty(dish.discountPrice) && (
                <Text textColor="blue.400" fontWeight="bold">
                  {t("common.price_number", { val: dish.discountPrice?.value })}
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

      {isOpen && (
        <ItemOptionModal
          isOpen={isOpen}
          onClose={onClose}
          dish={dish}
          options={currentOption}
          isFetching={dishOptionQuery.isFetching}
        />
      )}
    </>
  );
};

export default RestaurantMenuItem;
