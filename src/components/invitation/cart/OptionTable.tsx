import { Table, TableContainer, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import { get } from "radash";
import { FunctionComponent, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { shallow } from "zustand/shallow";
import useStore from "../../../hooks/store";
import { CartItem } from "../../../server/schemas/order";
import OptionRow from "./OptionRow";

type OptionTableProps = {
  cartItem: CartItem;
  dishName: string;
};

const OptionTable: FunctionComponent<OptionTableProps> = ({ cartItem, dishName }) => {
  const { t } = useTranslation();
  const { optionItemDict, dishDict } = useStore(
    (state) => ({
      optionDict: state.optionDict.dataV2.invitationPage,
      optionItemDict: state.optionItemDict.data.invitationPage?.optionItems || {},
      dishDict: state.dishDict.dataV2.invitationPage?.dishes || {},
    }),
    shallow,
  );

  const totalPrice = useMemo(() => {
    const totalOptionPrice = cartItem.options.reduce((acc, option) => {
      if (option.mandatory) {
        return acc + get(optionItemDict, `${option.value.optionItemId}.price.value`, 0)!;
      }
      return (
        acc +
        option.value.reduce(
          (acc, item) => acc + get(optionItemDict, `${item.optionItemId}.price.value`, 0)!,
          0,
        )
      );
    }, 0);
    return totalOptionPrice + get(dishDict, `${cartItem.dishId}.price.value`, 0)!;
  }, [cartItem]);

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
                val: get(dishDict, `${cartItem.dishId}.price.value`, 0),
              })}
            </Th>
          </Tr>
          {cartItem.options.map((option) => (
            <OptionRow dishId={cartItem.dishId} option={option} key={option.id} />
          ))}
          <Tr>
            <Th>{t("invitation_page.total_price")}</Th>
            <Th />
            <Th>
              {t("common.price_number", {
                val: totalPrice,
              })}
            </Th>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default OptionTable;
