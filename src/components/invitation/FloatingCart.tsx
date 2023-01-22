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
import shallow from "zustand/shallow";
import useStore from "../../hooks/store";

const FloatingCart = () => {
  const { t } = useTranslation();
  const {
    cart: { data: cart },
    optionDict: { data: optionDict },
    dishDict: { data: dishDict },
  } = useStore(
    (state) => ({
      dishDict: state.dishDict,
      cart: state.cart,
      optionDict: state.optionDict,
    }),
    shallow
  );

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
                <Heading>
                  {get(
                    dishDict,
                    `dishes.${cartItem.dishId}.name`,
                    t("inivitation_page.unknown_dish")
                  )}
                </Heading>
                {isEmpty(cartItem.options) ? null : (
                  <TableContainer whiteSpace="normal">
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>{t("invitation_page.cart_option")}</Th>
                          <Th>{t("invitation_page.cart_items")}</Th>
                          <Th>{t("invitation_page.price")}</Th>
                        </Tr>
                      </Thead>
                      <Tbody width={5}>
                        {cartItem.options.map((option) => (
                          <Tr key={option.optionId}>
                            <Th>
                              {get(
                                options,
                                `${cartItem.dishId}.${option.optionId}.name`,
                                t("inivitation_page.unknown_option")
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
                                        t("inivitation_page.unknown_item")
                                      )}{" "}
                                    </Text>
                                  ))}
                                </VStack>
                              )}
                            </Th>
                            <Th>
                              {option.mandatory ? (
                                <Text>
                                  {t("common.price_number", {
                                    val: get(
                                      options,
                                      `${cartItem.dishId}.${option.optionId}.items.${option.optionId}.price.text`,
                                      t("inivitation_page.unknown_item")
                                    ),
                                  })}
                                </Text>
                              ) : (
                                <VStack alignItems="flex-start">
                                  {option.value.map((item) => (
                                    <Text key={item}>
                                      {t("common.price_number", {
                                        val: get(
                                          options,
                                          `${cartItem.dishId}.${option.optionId}.items.${item}.price.value`,
                                          t("inivitation_page.unknown_item")
                                        ),
                                      })}
                                    </Text>
                                  ))}
                                </VStack>
                              )}
                            </Th>
                          </Tr>
                        ))}
                        <Tr>
                          <Th>{t("invitation_page.total_price")}</Th>
                          <Th />
                          <Th>
                            {t("common.price_number", {
                              val:
                                (get(
                                  dishDict,
                                  `dishes.${cartItem.dishId}.price.value`,
                                  0
                                ) as number) + // TODO: waiting for a fix
                                cartItem.options.reduce((acc, option) => {
                                  return (
                                    acc +
                                    (option.mandatory
                                      ? (get(
                                          options,
                                          `${cartItem.dishId}.${option.optionId}.items.${option.optionId}.price.value`,
                                          0
                                        ) as number) // TODO: waiting for a fix
                                      : option.value.reduce((acc, item) => {
                                          return (
                                            acc +
                                            (get(
                                              options,
                                              `${cartItem.dishId}.${option.optionId}.items.${item}.price.value`,
                                              0
                                            ) as number) // TODO: waiting for a fix
                                          );
                                        }, 0))
                                  );
                                }, 0),
                            })}
                          </Th>
                        </Tr>
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
