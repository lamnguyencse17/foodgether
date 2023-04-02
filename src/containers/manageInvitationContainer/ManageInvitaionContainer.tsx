import { InvitationOrder } from "../../pages/invitation/[id]/manage";
import { Accordion, AccordionItem, VStack } from "@chakra-ui/react";
import { AccorditionHeader } from "../../components/managerInvitation/AccorditionHeader";

interface ManageInvitaionContainerProps {
  orders: InvitationOrder[];
}
import { PricePerOrder } from "../../components/managerInvitation/PricePerOrder";
import { InvationOrderInfoContainer } from "./InvationOrderInfoContainer";

export const ManageInvitaionContainer = (props: ManageInvitaionContainerProps) => {
  const { orders } = props;

  return (
    <VStack
      width="100%"
      height="100%"
      paddingX={4}
      alignItems={["center", "center", "flex-start"]}
      flex={1}
    >
      <Accordion allowToggle width="100%">
        {orders.map((order) => (
          <AccordionItem key={order.id} width="100%">
            {order.orderedBy && (
              <AccorditionHeader
                orderBy={order.orderedBy}
                TotalPrice={<PricePerOrder orderDishes={order.orderDishes} />}
              />
            )}

            <InvationOrderInfoContainer
              orderDishes={order.orderDishes}
              invitationId={order.invitationId}
            />
          </AccordionItem>
        ))}
      </Accordion>
    </VStack>
  );
};
