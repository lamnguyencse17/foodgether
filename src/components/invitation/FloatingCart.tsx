import {
  Box,
  Button,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
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
          <ModalBody>
            {cart.map((cartItem) => (
              <VStack key={cartItem.uid}>
                <Heading>{cartItem.dishId}</Heading>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>{t("invitation_page.cart_option")}</Th>
                        <Th>{t("invitation_page.cart_items")}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {cartItem.options.map((option) => (
                        <Tr key={option.optionId}>
                          <Th>{option.optionId}</Th>
                          <Th>
                            {option.mandatory ? (
                              <Text>{option.value}</Text>
                            ) : (
                              <VStack>
                                {option.value.map((item) => (
                                  <Text key={item}>{item}</Text>
                                ))}
                              </VStack>
                            )}
                          </Th>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </VStack>
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
