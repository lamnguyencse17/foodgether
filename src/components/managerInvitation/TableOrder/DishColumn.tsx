import { Tr, Th } from "@chakra-ui/react";
import { isEmpty } from "radash";
import { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { InvitationOrder } from "../../../pages/invitation/[id]/manage";
import { Price } from "../../../types/shared";

interface DishColumnProps {
  invitationDish: InvitationOrder["orderDishes"][0]["invitationDish"];
  index: number;
}

export const DishColumn = (props: PropsWithChildren<DishColumnProps>) => {
  const { invitationDish, children, index } = props;
  const { t } = useTranslation();
  const getDishPrice = (invitationDish: InvitationOrder["orderDishes"][0]["invitationDish"]) => {
    if (isEmpty(invitationDish.discountPrice)) {
      return (invitationDish.price as Price).value;
    }
    return (invitationDish.discountPrice as Price).value;
  };

  return (
    <Tr>
      <Th>
        {index}. {invitationDish.name}
      </Th>
      <Th />
      <Th>
        {t("common.price_number", {
          val: getDishPrice(invitationDish),
        })}
      </Th>
      {children}
    </Tr>
  );
};
