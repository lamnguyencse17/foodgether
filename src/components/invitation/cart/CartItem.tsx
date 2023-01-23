import {
  Heading,
  StackDivider,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { get, isEmpty } from "radash";
import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { shallow } from "zustand/shallow";
import useStore from "../../../hooks/store";
import { CartItem } from "../../../server/schemas/order";

type CartItemProps = {
  cartItem: CartItem;
};

const CartItem: FunctionComponent<CartItemProps> = ({ cartItem }) => {
  const { t } = useTranslation();
  const {
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

  return (
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
                          <Text key={item.id}>
                            {get(
                              options,
                              `${cartItem.dishId}.${option.optionId}.items.${item.id}.name`,
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
                          val: option.price,
                        })}
                      </Text>
                    ) : (
                      <VStack alignItems="flex-start">
                        {option.value.map((item) => (
                          <Text key={item.id}>
                            {t("common.price_number", {
                              val: item.price,
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
                    val: cartItem.totalPrice,
                  })}
                </Th>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </VStack>
  );
};

export default CartItem;
