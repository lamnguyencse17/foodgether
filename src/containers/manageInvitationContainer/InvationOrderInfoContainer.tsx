import { AccordionPanel, Table, TableContainer, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { PricePerOrder } from "../../components/managerInvitation/PricePerOrder";
import { DishColumn } from "../../components/managerInvitation/TableOrder/DishColumn";

import { InvitationOrder } from "../../pages/invitation/[id]/manage";
import { Price } from "../../types/shared";
import { EditCartContainer } from "./EditCartContainer";
interface InvationOrderInfoContainerProps {
  invitationId: string;
  orderDishes: InvitationOrder["orderDishes"];
}

export const InvationOrderInfoContainer = (props: InvationOrderInfoContainerProps) => {
  const { orderDishes } = props;
  const { t } = useTranslation();

  const getOrderOptionPrice = (
    option: InvitationOrder["orderDishes"][0]["orderDishOptions"][0]["orderDishOptionItems"][0]["invitationOptionItem"],
  ) => {
    return (option.price as Price).value;
  };

  const handleEdit = () => {};

  return (
    <AccordionPanel pb={4}>
      <TableContainer whiteSpace="normal">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>{t("invitation_page.cart_option")}</Th>
              <Th>{t("invitation_page.cart_items")}</Th>
              <Th>{t("invitation_page.price")}</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody width={5}>
            {orderDishes.map((orderDish, index) => (
              <>
                <DishColumn invitationDish={orderDish.invitationDish} index={index + 1}>
                  <Th>
                    <EditCartContainer
                      invitationDishId={orderDish.invitationDishId}
                      orderDishOptions={orderDish.orderDishOptions}
                    />
                  </Th>
                </DishColumn>

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
            <Th />
          </Tr>
        </Table>
      </TableContainer>
    </AccordionPanel>
  );
};
