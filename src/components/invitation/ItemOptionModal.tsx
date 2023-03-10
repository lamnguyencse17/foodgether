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
import { InvitationOption } from "@prisma/client";
import { get, isEmpty, listify } from "radash";
import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { InvitationDishWithPriceAndPhoto } from "../../types/dish";
import SingleMandatoryOption from "./option/SingleMandatoryOption";
import MultipleOptionalChoice from "./option/MultipleOptionalChoice";
import useStore from "../../hooks/store";
import { cartItemSchema } from "../../server/schemas/order";
import { shallow } from "zustand/shallow";
import { nanoid } from "nanoid/async";
import { OptionDictOptionData } from "../../hooks/store/optionDict";

type ItemOptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  options?: (InvitationOption & {
    invitationOptionItems: number[];
  })[];
  dish?: InvitationDishWithPriceAndPhoto;
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
    dishDict,
    cart: { addToCart, editCartItem },
    optionDict,
    setToast,
  } = useStore(
    (state) => ({
      currentDishOption: state.currentDishOption,
      optionDict: state.optionDict.data,
      dishDict: state.dishDict.dataV2.invitationPage?.dishes,
      cart: state.cart,
      setToast: state.toast.setToast,
    }),
    shallow,
  );

  const isEditing = !!cartItemId;

  const onOrder = async () => {
    const dishOption = get(optionDict, `options.${dish?.id}`, {}) as OptionDictOptionData;
    let haveAllMandatoryOption = true;
    listify(dishOption, (_, value) => ({ ...value })).forEach((menuOption) => {
      if (!menuOption.isMandatory || !haveAllMandatoryOption) {
        return;
      }
      let selectedOptionItems = currentDishOption[menuOption.id]?.value;
      let unifiedSelectedOptionItems = [selectedOptionItems || []].flat();
      const { minQuantity, maxQuantity } = menuOption;
      if (
        !(
          unifiedSelectedOptionItems.length >= minQuantity &&
          unifiedSelectedOptionItems.length <= maxQuantity &&
          unifiedSelectedOptionItems.every(
            ({ optionItemId }) => !!get(menuOption.items, optionItemId.toString()),
          )
        )
      ) {
        haveAllMandatoryOption = false;
      }
    });

    if (!haveAllMandatoryOption) {
      setToast("error", {
        title: t("error.C_01") as string,
      });
      return;
    }
    const currentOptionList = listify(currentDishOption, (_, value) => value);

    const newCartItem = {
      options: currentOptionList.filter((option) => !isEmpty(option.value)),
      dishId: dish!.id,
      id: isEditing ? cartItemId : await nanoid(20),
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
    <Modal isOpen={isOpen} onClose={onCloseModal}>
      <ModalOverlay />
      {dish && (
        <ModalContent maxW="600px">
          <ModalHeader>
            <Heading size="md">
              {dish.name} - {t("invitation_page.option")}
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isEmpty(options) && !isFetching && <Text>{t("restaurant_page.empty_option")}</Text>}
            {isEmpty(options) && isFetching && <SkeletonText noOfLines={5} skeletonHeight={4} />}
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
                      {option.isMandatory && "*"}
                    </Heading>
                    {option.isMandatory && option.maxQuantity === 1 ? (
                      <SingleMandatoryOption
                        items={option.invitationOptionItems}
                        name={option.name}
                        key={option.id}
                        optionId={option.id}
                        dishId={dish.id}
                      />
                    ) : (
                      <MultipleOptionalChoice
                        optionItemIdList={option.invitationOptionItems}
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
      )}
    </Modal>
  );
};

export default ItemOptionModal;
