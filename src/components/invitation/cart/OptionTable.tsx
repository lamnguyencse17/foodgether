import { Table, TableContainer, Tbody, Text, Th, Thead, Tr, VStack } from "@chakra-ui/react";
import { get } from "radash";
import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { shallow } from "zustand/shallow";
import useStore from "../../../hooks/store";
import { CartItem } from "../../../server/schemas/order";

type OptionTableProps = {
  cartItem: CartItem;
  dishName: string;
};

const OptionTable: FunctionComponent<OptionTableProps> = ({ cartItem, dishName }) => {
  const { t } = useTranslation();
  const { optionDict, optionItemDict } = useStore(
    (state) => ({
      optionDict: state.optionDict.dataV2.invitationPage,
      optionItemDict: state.optionItemDict.data.invitationPage?.optionItems,
    }),
    shallow,
  );
  const options = optionDict?.options || {};

  return (
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
          <Tr>
            <Th>{dishName}</Th>
            <Th />
            <Th>
              {t("common.price_number", {
                val: cartItem.dishPrice,
              })}
            </Th>
          </Tr>
          {cartItem.options.map((option) => (
            <Tr key={option.id}>
              <Th>
                {get(
                  options,
                  `${cartItem.dishId}.${option.optionId}.name`,
                  t("inivitation_page.unknown_option"),
                )}
              </Th>
              <Th>
                {option.mandatory ? (
                  <Text>
                    {get(
                      optionItemDict,
                      `${option.value.optionItemId}.name`,
                      t("inivitation_page.unknown_item"),
                    )}
                  </Text>
                ) : (
                  <VStack alignItems="flex-start">
                    {option.value.map((item) => (
                      <Text key={item.id}>
                        {get(
                          optionItemDict,
                          `${item.optionItemId}.name`,
                          t("inivitation_page.unknown_item"),
                        )}
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
  );
};

export default OptionTable;
