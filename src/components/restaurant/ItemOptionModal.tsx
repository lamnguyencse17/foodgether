import {
  Box,
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { Option, OptionItem } from "@prisma/client";
import { isEmpty } from "radash";
import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { DishWithPriceAndPhoto } from "../../types/dish";
import SingleMandatoryOption from "./option/SingleMandatoryOption";
import MultipleOptionalChoice from "./option/MultipleOptionalChoice";

type ItemOptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  options?: (Option & {
    items: OptionItem[];
  })[];
  dish: DishWithPriceAndPhoto;
};

const ItemOptionModal: FunctionComponent<ItemOptionModalProps> = ({
  isOpen,
  onClose,
  options,
  dish,
}) => {
  const { t } = useTranslation();
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="600px">
        <ModalHeader>
          <Heading size="md">
            {dish.name} - {t("restaurant_page.option")}
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {!isEmpty(options) ? (
            (options || []).map((option) => {
              const optionConfig = option.isMandatory
                ? t("restaurant_page.mandatory_choice", {
                    amount: option.maxQuantity,
                  })
                : t("restaurant_page.optional_choice", {
                    amount: option.maxQuantity,
                  });
              return (
                <Box key={option.id} paddingY={3}>
                  <Heading size="sm" marginBottom={3}>
                    {option.name} {optionConfig}
                  </Heading>
                  {option.isMandatory && option.maxQuantity === 1 ? (
                    <SingleMandatoryOption
                      items={option.items}
                      name={option.name}
                      key={option.id}
                    />
                  ) : (
                    <MultipleOptionalChoice
                      items={option.items}
                      key={option.id}
                    />
                  )}
                </Box>
              );
            })
          ) : (
            <Text>{t("restaurant_page.empty_option")}</Text>
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ItemOptionModal;
