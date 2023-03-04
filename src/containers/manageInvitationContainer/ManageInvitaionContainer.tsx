import { InvitationOrder } from "../../pages/invitation/[id]/manage";
import { Accordion, AccordionItem, AccordionPanel, VStack } from "@chakra-ui/react";
import { AccorditionHeader } from "../../components/managerInvitation/AccorditionHeader";

interface ManageInvitaionContainerProps {
  orders: InvitationOrder[];
}
import { PricePerOrder } from "../../components/managerInvitation/PricePerOrder";
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
            <AccordionPanel pb={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </VStack>
  );
};
