import {
  Heading,
  HStack,
  IconButton,
  StackDivider,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { get, isEmpty } from "radash";
import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { shallow } from "zustand/shallow";
import useStore from "../../../hooks/store";
import { CartItem } from "../../../server/schemas/order";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import OptionTable from "./OptionTable";
import ItemOptionModal from "../ItemOptionModal";
import { InvitationDishWithPriceAndPhoto } from "../../../types/dish";
import { listifyInvitationOptions } from "../../../utils/transform";

type CartItemProps = {
  cartItem: CartItem;
};

const CartItem: FunctionComponent<CartItemProps> = ({ cartItem }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    dishDict,
    setDishOption,
    resetDishOption,
    optionDict,
    deleteCartItem,
  } = useStore(
    (state) => ({
      dishDict: state.dishDict.dataV2.invitationPage?.dishes,
      setDishOption: state.currentDishOption.setDishOption,
      resetDishOption: state.currentDishOption.resetDishOption,
      restaurant: state.restaurant.dataV2.invitationPage,
      optionDict: state.optionDict.dataV2.invitationPage?.options,
      deleteCartItem: state.cart.deleteCartItem,
    }),
    shallow
  );

  const dish = get(
    dishDict,
    cartItem.dishId.toString()
  ) as InvitationDishWithPriceAndPhoto;

  const option = (optionDict || {})[dish.id];
  const currentOptions = (option && listifyInvitationOptions(option)) || [];

  const onOpenEditModal = () => {
    cartItem.options.forEach((option) => {
      setDishOption(option);
    });
    onOpen();
  };

  const onCloseEditModal = () => {
    resetDishOption();
    onClose();
  };

  const onDeleteItem = () => {
    deleteCartItem(cartItem.id);
  };

  return (
    <>
      <VStack
        key={cartItem.id}
        divider={<StackDivider />}
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <HStack justifyContent="space-between" width="100%" alignItems="center">
          <Heading>
            {get(dish, "name", t("inivitation_page.unknown_dish"))}
          </Heading>
          <HStack gap={1}>
            <IconButton
              icon={<DeleteIcon />}
              aria-label={t("invitation_page.delete_this_dish")}
              onClick={onDeleteItem}
            />
            <IconButton
              icon={<EditIcon />}
              aria-label={t("invitation_page.edit_this_dish")}
              onClick={onOpenEditModal}
            />
          </HStack>
        </HStack>
        {isEmpty(cartItem.options) ? null : <OptionTable cartItem={cartItem} />}
      </VStack>
      <ItemOptionModal
        isOpen={isOpen}
        onClose={onCloseEditModal}
        dish={dish}
        options={currentOptions}
        cartItemId={cartItem.id}
      />
    </>
  );
};

export default CartItem;
