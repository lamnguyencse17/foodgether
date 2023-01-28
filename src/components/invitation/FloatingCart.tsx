import {
  Box,
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import deepEqual from "deep-equal";
import { isEmpty } from "radash";
import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { BiCart } from "react-icons/bi";
import { shallow } from "zustand/shallow";
import useStore from "../../hooks/store";
import {
  CartItem as CartItemType,
  createOrderSchema,
  editOrderSchema,
} from "../../server/schemas/order";
import { trpc } from "../../utils/trpc";
import CartItem from "./cart/CartItem";

type FloatingCartProps = {
  invitationId: string;
  previousCart?: CartItemType[];
};

const FloatingCart: FunctionComponent<FloatingCartProps> = ({
  invitationId,
  previousCart,
}) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    cart: { data: cart },
    restaurant,
  } = useStore(
    (state) => ({
      cart: state.cart,
      restaurant: state.restaurant.data,
    }),
    shallow
  );

  const onSuccess = () => {
    onClose();
  };

  const createOrder = trpc.order.createOrder.useMutation({ onSuccess });
  const editOrder = trpc.order.editOrder.useMutation({ onSuccess });

  const handleOrder = () => {
    const orderPayload = {
      restaurantId: restaurant?.id!,
      invitationId,
      items: cart,
    };

    if (isEmpty(previousCart)) {
      createOrderSchema.parse(orderPayload);
      createOrder.mutate(orderPayload);
      return;
    }
    const isSameCart = deepEqual(previousCart, cart);
    if (isSameCart) {
      return;
    }
    editOrderSchema.parse(orderPayload);
    editOrder.mutate(orderPayload);
  };

  const isSubmitting = createOrder.isLoading || editOrder.isLoading;

  if (isEmpty(cart)) {
    return null;
  }
  return (
    <>
      <Box
        position="sticky"
        display="flex"
        justifyContent="flex-end"
        bottom={3}
      >
        <IconButton
          icon={<BiCart size="2em" />}
          aria-label={t("invitation_page.cart")}
          size="lg"
          onClick={onOpen}
        />
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="600px">
          <ModalHeader>{t("invitation_page.your_current_cart")}</ModalHeader>
          <ModalCloseButton isDisabled={isSubmitting} />
          <ModalBody>
            {cart.map((cartItem) => (
              <CartItem cartItem={cartItem} key={cartItem.id} />
            ))}
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={onClose}
              isLoading={isSubmitting}
            >
              {t("common.close")}
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleOrder}
              isLoading={isSubmitting}
            >
              {t("invitation_page.order")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FloatingCart;
