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
import useStore from "../../hooks/store";

const FloatingCart = () => {
  const { t } = useTranslation();
  const { data: cart } = useStore((state) => state.cart);
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
        <ModalContent>
          <ModalHeader>{t("invitation_page.your_current_cart")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>

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
