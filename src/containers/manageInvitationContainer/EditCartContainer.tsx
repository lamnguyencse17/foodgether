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
  VStack,
  Checkbox,
  HStack,
} from "@chakra-ui/react";
import { cluster } from "radash";
import { useCallback, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { OptionConfig } from "../../components/shared/OptionConfig";
import { SingleMandatorySelect } from "../../components/shared/SingleMandatorySelect";
import { InvitationOrder, ManageContext } from "../../pages/invitation/[id]/manage";
import { trpc } from "../../utils/trpc";

interface EditCartContainerProps {
  invitationDishId: number;
  orderDishOptions: InvitationOrder["orderDishes"][0]["orderDishOptions"];
}

export const EditCartContainer = (props: EditCartContainerProps) => {
  const { invitationDishId, orderDishOptions } = props;
  const { onOpen, isOpen, onClose } = useDisclosure();
  const { t } = useTranslation();

  const { selectedDishes, invitationOptions } = useContext(ManageContext);

  const onSuccess = useCallback(() => {
    onClose();
  }, [onClose]);

  const [selectedOptionItems, setSelectedOptionItems] = useState([]);

  const editOrder = trpc.order.editOrder.useMutation({ onSuccess });

  const handleOrder = () => {};

  const renderModalBody = () => {
    if (!selectedDishes || !selectedDishes[invitationDishId.toString()] || !invitationOptions) {
      return <Text>{t("invitation_manage_page.empty_option")}</Text>;
    }

    return selectedDishes[invitationDishId.toString()]?.invitationDishOptions.map((dishOption) => {
      const invitationOption = invitationOptions[dishOption.optionId];

      if (!invitationOption) {
        return <></>;
      }
      const { isMandatory, maxQuantity, name } = invitationOption;

      if (invitationOption.isMandatory && invitationOption.maxQuantity === 1) {
        const options = invitationOption.invitationOptionItems.map((option) => ({
          id: option.id,
          name: option.name,
        }));

        return (
          <>
            <OptionConfig isMandatory={isMandatory} maxQuantity={maxQuantity} name={name} />
            <SingleMandatorySelect
              key={dishOption.id}
              options={options}
              value={1}
              onChangeOption={() => {}}
            />
          </>
        );
      }

      const isChecked = (id: number, invitationOptionId: number) => {
        const order = orderDishOptions.find(
          (orderDish) => orderDish.invitationOptionId === invitationOptionId,
        );

        return order?.orderDishOptionItems.some(
          (orderDishOption) => orderDishOption.invitationOptionItem.id === id,
        );
      };

      const hItems = cluster(
        invitationOption.invitationOptionItems,
        Math.ceil(invitationOption.invitationOptionItems.length / 2),
      );

      return (
        <>
          <OptionConfig isMandatory={isMandatory} maxQuantity={maxQuantity} name={name} />
          <HStack justifyContent="start" alignItems="start" width="100%">
            {hItems.map((items, index) => (
              <VStack key={index} justifyContent="start" alignItems="start">
                {items.map((item) => (
                  <Checkbox
                    key={item.id}
                    isChecked={isChecked(item.id || 0, item.invitationOptionId || 0)}
                  >
                    {item.name}
                  </Checkbox>
                ))}
              </VStack>
            ))}
          </HStack>
        </>
      );
    });
  };

  return (
    <div>
      <IconButton icon={<EditIcon />} aria-label="Edit Icon" onClick={onOpen} margin={0} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="600px">
          <ModalHeader>{t("invitation_page.your_current_cart")}</ModalHeader>
          <ModalCloseButton isDisabled={editOrder.isLoading} />

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
