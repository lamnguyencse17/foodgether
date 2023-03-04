import { AccordionPanel, Table, TableContainer, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import { isEmpty } from "radash";
import { useTranslation } from "react-i18next";
import { PricePerOrder } from "../../components/managerInvitation/PricePerOrder";
import { DishColumn } from "../../components/managerInvitation/TableOrder/DishColumn";

import { InvitationOrder } from "../../pages/invitation/[id]/manage";
import { Price } from "../../types/shared";

interface InvationOrderInfoContainerProps {
  orderDishes: InvitationOrder["orderDishes"];
}

export const InvationOrderInfoContainer = (props: InvationOrderInfoContainerProps) => {
  const { orderDishes } = props;
  const { t } = useTranslation();

  const getDishPrice = (invitationDish: InvitationOrder["orderDishes"][0]["invitationDish"]) => {
    if (isEmpty(invitationDish.discountPrice)) {
      return (invitationDish.price as Price).value;
    }
    return (invitationDish.discountPrice as Price).value;
  };

  const getOrderOptionPrice = (
    option: InvitationOrder["orderDishes"][0]["orderDishOptions"][0]["orderDishOptionItems"][0]["invitationOptionItem"],
  ) => {
    return (option.price as Price).value;
  };

  return (
    <AccordionPanel pb={4}>
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
            {orderDishes.map((orderDish) => (
              <>
                <DishColumn invitationDish={orderDish.invitationDish} />

                {orderDish.orderDishOptions.map((orderDishOption) =>
                  orderDishOption.orderDishOptionItems.map((item) => (
                    <Tr key={item.id}>
                      <Th />
                      <Th>{item.invitationOptionItem.name}</Th>
                      <Th>
                        {t("common.price_number", {
                          val: getOrderOptionPrice(item.invitationOptionItem),
                        })}
                      </Th>
                    </Tr>
                  )),
                )}
              </>
            ))}
          </Tbody>
          <Tr>
            <Th>{t("invitation_page.total_price")}</Th>
            <Th />
            <Th>
              <PricePerOrder orderDishes={orderDishes} />
            </Th>
          </Tr>
        </Table>
      </TableContainer>
    </AccordionPanel>
  );
};
