import { Text } from "@chakra-ui/react";
import { isEmpty, sum } from "radash";
import { useTranslation } from "react-i18next";
import { InvitationOrder } from "../../pages/invitation/[id]/manage";
import { Price } from "../../types/shared";
interface PricePerOrderProps {
  orderDishes: InvitationOrder["orderDishes"];
}

type InvitationDish = InvitationOrder["orderDishes"][0]["invitationDish"];
type InvitationOptionItem =
  InvitationOrder["orderDishes"][0]["orderDishOptions"][0]["orderDishOptionItems"];

export const PricePerOrder = (props: PricePerOrderProps) => {
  const { t } = useTranslation();

  const { orderDishes } = props;
  let totalPrice = 0;

  const getInvitationDishPrice = (invataionDish: InvitationDish) => {
    if (isEmpty(invataionDish.discountPrice)) {
      return (invataionDish.price as Price).value;
    }
    return (invataionDish.discountPrice as Price).value;
  };

  const getOrderDishOptionPrice = (invitationOptionItems: InvitationOptionItem) => {
    return sum(invitationOptionItems, (item) => (item.invitationOptionItem.price as Price).value);
  };

  const getTotalPrice = () => {
    orderDishes.forEach((orderDish) => {
      totalPrice += getInvitationDishPrice(orderDish.invitationDish);

      orderDish.orderDishOptions.forEach((orderDishOption) => {
        totalPrice += getOrderDishOptionPrice(orderDishOption.orderDishOptionItems);
      });
    });
    return totalPrice;
  };

  return (
    <Text>
      {t("common.price_number", {
        val: getTotalPrice(),
      })}
    </Text>
  );
};
