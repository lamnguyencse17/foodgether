import { EditIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  ModalCloseButton,
  ModalBody,
  Text,
  Checkbox,
  VStack,
} from "@chakra-ui/react";
import { get } from "radash";
import { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ManageContext } from "../../pages/invitation/[id]/manage";
import { trpc } from "../../utils/trpc";

interface EditCartContainerProps {
  invitationDishId: number;
}

export const EditCartContainer = (props: EditCartContainerProps) => {
  const { invitationDishId } = props;
  const { onOpen, isOpen, onClose } = useDisclosure();
  const { t } = useTranslation();

  const onSuccess = useCallback(() => {
    onClose();
  }, [onClose]);
  const editOrder = trpc.order.editOrder.useMutation({ onSuccess });

  const handleOrder = () => {};

  const renderModalBody = () => {
    if (!selectedDishes || !selectedDishes[invitationDishId.toString()] || !invitationOptions) {
      return <Text>{t("invitation_manage_page.empty_option")}</Text>;
    }

    const sele = selectedDishes[invitationDishId.toString()];
    console.log({ sele });
    return selectedDishes[invitationDishId.toString()]?.invitationDishOptions.map((dishOption) => (
      <VStack key={dishOption.id} display="flex" alignItems="flex-start">
        <Checkbox key={dishOption.id}>
          {get(invitationOptions[dishOption.optionId], "name", "mome")}
        </Checkbox>
      </VStack>
    ));
  };

  const { selectedDishes, invitationOptions } = useContext(ManageContext);
  console.log("coollll", invitationOptions);

  return (
    <div>
      <IconButton icon={<EditIcon />} aria-label="Edit Icon" onClick={onOpen} margin={0} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="600px">
          <ModalHeader>{t("invitation_page.your_current_cart")}</ModalHeader>
          <ModalCloseButton isDisabled={editOrder.isLoading} />
          {/* <ModalBody>
            {cart.map((cartItem) => (
              <CartItem cartItem={cartItem} key={cartItem.id} />
            ))}
          </ModalBody> */}

          <ModalBody>{renderModalBody()}</ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose} isLoading={editOrder.isLoading}>
              {t("common.close")}
            </Button>
            <Button colorScheme="blue" onClick={handleOrder} isLoading={editOrder.isLoading}>
              {t("invitation_page.order")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
