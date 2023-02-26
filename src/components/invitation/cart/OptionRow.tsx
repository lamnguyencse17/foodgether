import { Text, Th, Tr, VStack } from "@chakra-ui/react";
import { get } from "radash";
import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { shallow } from "zustand/shallow";
import useStore from "../../../hooks/store";
import { DishOptionValue } from "../../../server/schemas/order";

type OptionRowProps = {
  dishId: number;
  option: DishOptionValue;
};

const OptionRow: FunctionComponent<OptionRowProps> = ({ dishId, option }) => {
  const { t } = useTranslation();
  const { optionItemDict, options } = useStore(
    (state) => ({
      options: state.optionDict.dataV2.invitationPage?.options || {},
      optionItemDict: state.optionItemDict.data.invitationPage?.optionItems,
    }),
    shallow,
  );

  return (
    <Tr>
      <Th>
        {get(options, `${dishId}.${option.optionId}.name`, t("inivitation_page.unknown_option"))}
      </Th>
      <Th>
        {option.mandatory ? (
          <Text>
            {get(
              optionItemDict,
              `${option.value.optionItemId}.name`,
              t("inivitation_page.unknown_item"),
            )}
          </Text>
        ) : (
          <VStack alignItems="flex-start">
            {option.value.map((item) => (
              <Text key={item.id}>
                {get(
                  optionItemDict,
                  `${item.optionItemId}.name`,
                  t("inivitation_page.unknown_item"),
                )}
              </Text>
            ))}
          </VStack>
        )}
      </Th>
      <Th>
        {option.mandatory ? (
          <Text>
            {t("common.price_number", {
              val: get(optionItemDict, `${option.value.optionItemId}.price.value`),
            })}
          </Text>
        ) : (
          <VStack alignItems="flex-start">
            {option.value.map((item) => (
              <Text key={item.id}>
                {t("common.price_number", {
                  val: get(optionItemDict, `${item.optionItemId}.price.value`),
                })}
              </Text>
            ))}
          </VStack>
        )}
      </Th>
    </Tr>
  );
};

export default OptionRow;
