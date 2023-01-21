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
  Text,
} from "@chakra-ui/react";
import { Option, OptionItem } from "@prisma/client";
import { isEmpty, uid } from "radash";
import { FunctionComponent, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DishWithStringDate } from "../../types/dish";
import SingleMandatoryOption from "./option/SingleMandatoryOption";
import MultipleOptionalChoice from "./option/MultipleOptionalChoice";
import useStore from "../../hooks/store";
import { cartItemSchema } from "../../server/schemas/order";

type ItemOptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  options?: (Option & {
    items: OptionItem[];
  })[];
  dish: DishWithStringDate;
};

const ItemOptionModal: FunctionComponent<ItemOptionModalProps> = ({
  isOpen,
  onClose,
  options,
  dish,
}) => {
  const { t } = useTranslation();
  const { data: currentDishOption, resetDishOption } = useStore(
    (state) => state.currentDishOption
  );
  const { addToCart } = useStore((state) => state.cart);

  useEffect(() => {
    return () => {};
  }, []);

  const onOrder = () => {
    const newCartItem = {
      options: currentDishOption,
      dishId: dish.id,
      uid: uid(7),
    };
    cartItemSchema.parse(newCartItem);
    addToCart(newCartItem);
    onCloseModal();
  };

  const onCloseModal = () => {
    resetDishOption();
    onClose();
  };

  if (!options) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading size="md">
            {dish.name} - {t("invitation_page.option")}
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {!isEmpty(options) ? (
            options.map((option) => {
              const optionConfig = option.isMandatory
                ? t("invitation_page.mandatory_choice", {
                    amount: option.maxQuantity,
                  })
                : t("invitation_page.optional_choice", {
                    amount: option.maxQuantity,
                  });
              return (
                <Box key={option.id} paddingY={3}>
                  <Heading size="sm" marginBottom={3}>
                    {option.name} {optionConfig}
                  </Heading>
                  {option.isMandatory && option.maxQuantity === 1 ? (
                    <SingleMandatoryOption
                      items={option.items}
                      name={option.name}
                      key={option.id}
                      optionId={option.id}
                    />
                  ) : (
                    <MultipleOptionalChoice
                      items={option.items}
                      key={option.id}
                      optionId={option.id}
                      maxQuantity={option.maxQuantity}
                    />
                  )}
                </Box>
              );
            })
          ) : (
            <Text>{t("invitation_page.empty_option")}</Text>
          )}
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
