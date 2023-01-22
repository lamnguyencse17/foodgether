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
  StackDivider,
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
import { get, isEmpty } from "radash";
import { useTranslation } from "react-i18next";
import { BiCart } from "react-icons/bi";
import useStore from "../../hooks/store";

const FloatingCart = () => {
  const { t } = useTranslation();
  const { data: cart } = useStore((state) => state.cart);
  const { data: optionDict } = useStore((state) => state.optionDict);
  const options = optionDict?.options || {};
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
              <VStack
                key={cartItem.uid}
                divider={<StackDivider />}
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                <Heading>{cartItem.dishId}</Heading>
                {isEmpty(cartItem.options) ? null : (
                  <TableContainer whiteSpace="normal">
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>{t("invitation_page.cart_option")}</Th>
                          <Th>{t("invitation_page.cart_items")}</Th>
                        </Tr>
                      </Thead>
                      <Tbody width={5}>
                        {cartItem.options.map((option) => (
                          <Tr key={option.optionId}>
                            <Th>
                              {get(
                                options,
                                `${cartItem.dishId}.${option.optionId}.name`,
                                "Unknown option"
                              )}
                            </Th>
                            <Th>
                              {option.mandatory ? (
                                <Text>{option.value}</Text>
                              ) : (
                                <VStack alignItems="flex-start">
                                  {option.value.map((item) => (
                                    <Text key={item}>
                                      {get(
                                        options,
                                        `${cartItem.dishId}.${option.optionId}.items.${item}.name`,
                                        "Unknown option item"
                                      )}
                                    </Text>
                                  ))}
                                </VStack>
                              )}
                            </Th>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                )}
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
