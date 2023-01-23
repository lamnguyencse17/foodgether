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
import { isEmpty } from "radash";
import { useTranslation } from "react-i18next";
import { BiCart } from "react-icons/bi";
import { shallow } from "zustand/shallow";
import useStore from "../../hooks/store";
import CartItem from "./cart/CartItem";

const FloatingCart = () => {
  const { t } = useTranslation();
  const {
    cart: { data: cart },
  } = useStore(
    (state) => ({
      dishDict: state.dishDict,
      cart: state.cart,
      optionDict: state.optionDict,
    }),
    shallow
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
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
          <ModalCloseButton />
          <ModalBody>
            {cart.map((cartItem) => (
              <CartItem cartItem={cartItem} key={cartItem.uid} />
            ))}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              {t("common.close")}
            </Button>
            <Button variant="ghost">{t("invitation_page.order")}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FloatingCart;
