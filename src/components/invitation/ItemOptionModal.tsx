import {
  Box,
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import { Option, OptionItem } from "@prisma/client";
import { get, isEmpty, uid } from "radash";
import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { DishWithPriceAndPhoto } from "../../types/dish";
import SingleMandatoryOption from "./option/SingleMandatoryOption";
import MultipleOptionalChoice from "./option/MultipleOptionalChoice";
import useStore from "../../hooks/store";
import { cartItemSchema } from "../../server/schemas/order";
import { shallow } from "zustand/shallow";
import { nanoid } from "nanoid/async";

type ItemOptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  options?: (Option & {
    items: OptionItem[];
  })[];
  dish: DishWithPriceAndPhoto;
  isFetching?: boolean;
  cartItemId?: string;
};

const ItemOptionModal: FunctionComponent<ItemOptionModalProps> = ({
  isOpen,
  onClose,
  options,
  dish,
  isFetching = false,
  cartItemId,
}) => {
  const { t } = useTranslation();
  const {
    currentDishOption: { data: currentDishOption, resetDishOption },
    dishDict: { data: dishDict },
    cart: { addToCart, editCartItem },
  } = useStore(
    (state) => ({
      currentDishOption: state.currentDishOption,
      optionDict: state.optionDict,
      dishDict: state.dishDict,
      cart: state.cart,
    }),
    shallow
  );

  const isEditing = !!cartItemId;

  const onOrder = async () => {
    const dishPrice = get(
      dishDict,
      `dishes.${dish.id}.price.value`,
      0
    ) as number;
    const totalOptionPrice = currentDishOption.reduce((acc, option) => {
      return acc + option.price;
    }, 0);

    const newCartItem = {
      options: currentDishOption,
      dishId: dish.id,
      id: isEditing ? cartItemId : await nanoid(20),
      dishPrice,
      totalPrice: dishPrice + totalOptionPrice,
    };
    cartItemSchema.parse(newCartItem);
    isEditing ? editCartItem(newCartItem) : addToCart(newCartItem);
    onCloseModal();
  };

  const onCloseModal = () => {
    resetDishOption();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="600px">
        <ModalHeader>
          <Heading size="md">
            {dish.name} - {t("invitation_page.option")}
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isEmpty(options) && !isFetching && (
            <Text>{t("restaurant_page.empty_option")}</Text>
          )}
          {isEmpty(options) && isFetching && (
            <SkeletonText noOfLines={5} skeletonHeight={4} />
          )}
          {!isEmpty(options) &&
            !isFetching &&
            (options || []).map((option) => {
              const optionConfig = option.isMandatory
                ? t("invitation_page.mandatory_choice", {
                    amount: option.maxQuantity,
                  })
                : t("invitation_page.optional_choice", {
                    amount: option.maxQuantity,
                  });
              return (
                <Box key={option.id} paddingY={3} width="100%">
                  <Heading size="sm" marginBottom={3}>
                    {option.name} {optionConfig}
                  </Heading>
                  {option.isMandatory && option.maxQuantity === 1 ? (
                    <SingleMandatoryOption
                      items={option.items}
                      name={option.name}
                      key={option.id}
                      optionId={option.id}
                      dishId={dish.id}
                    />
                  ) : (
                    <MultipleOptionalChoice
                      items={option.items}
                      key={option.id}
                      optionId={option.id}
                      maxQuantity={option.maxQuantity}
                      dishId={dish.id}
                    />
                  )}
                </Box>
              );
            })}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onCloseModal}>
            {t("common.close")}
          </Button>
          <Button colorScheme="blue" onClick={onOrder}>
            {t("invitation_page.order")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ItemOptionModal;
