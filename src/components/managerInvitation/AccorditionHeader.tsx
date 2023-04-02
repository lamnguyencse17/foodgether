import { AccordionButton, AccordionIcon, Box, HStack } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { OrderBy } from "../../types/shared";
import { get } from "radash";
interface AccorditionHeaderProps {
  orderBy: OrderBy;
  TotalPrice: ReactNode;
}
export const AccorditionHeader = (props: AccorditionHeaderProps) => {
  const { orderBy, TotalPrice } = props;
  const { t } = useTranslation();
  return (
    <h2>
      <AccordionButton justifyContent="space-between">
        <Box>
          {t("invitation_manage_page.order_by")} {get(orderBy, "name", "Anonymous")}
        </Box>
        <HStack>
          {TotalPrice}
          <AccordionIcon />
        </HStack>
      </AccordionButton>
    </h2>
  );
};
