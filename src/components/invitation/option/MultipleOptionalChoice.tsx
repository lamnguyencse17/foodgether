import { Checkbox, CheckboxGroup, HStack, VStack } from "@chakra-ui/react";
import { OptionItem } from "@prisma/client";
import { nanoid } from "nanoid/async";
import { cluster, get, toggle } from "radash";
import { ChangeEvent, FunctionComponent } from "react";
import { shallow } from "zustand/shallow";
import useStore from "../../../hooks/store";
import {
  dishOptionValueSchema,
  OptionChoiceValue,
} from "../../../server/schemas/order";

type MultipleOptionalChoiceProps = {
  items: OptionItem[];
  optionId: number;
  maxQuantity: number;
  dishId: number;
};

const MultipleOptionalChoice: FunctionComponent<
  MultipleOptionalChoiceProps
> = ({ items, optionId, maxQuantity, dishId }) => {
  const {
    currentDishOption: { setDishOption, data },
    optionDict: { data: optionDict },
  } = useStore(
    (state) => ({
      currentDishOption: state.currentDishOption,
      optionDict: state.optionDict,
    }),
    shallow
  );
  const dict = optionDict?.options || {};
  const value = (data.find((option) => option.optionId === optionId)?.value ||
    []) as OptionChoiceValue["value"];
  const hItems = cluster(items, Math.ceil(items.length / 2));

  const handleChange = async (
    e: ChangeEvent<HTMLInputElement>,
    item: OptionItem
  ) => {
    const newValue = toggle(
      value,
      {
        id: await nanoid(20),
        price: get(
          dict,
          `${dishId}.${optionId}.items.${item.id}.price.value`,
          0
        ) as number,
        optionItemId: item.id,
      },
      (optionItem) => optionItem.id
    );
    const dishOption = {
      optionId,
      mandatory: false as const,
      value: newValue,
      price: newValue.reduce((acc, v) => acc + v.price, 0),
      id: await nanoid(20),
    };
    dishOptionValueSchema.parse(dishOption);
    setDishOption(dishOption);
  };

  const displayValues = value.map((v) => v.optionItemId);

  return (
    <CheckboxGroup value={displayValues}>
      <HStack justifyContent="start" alignItems="start" width="100%">
        {hItems.map((vItem, index) => (
          <VStack key={index} justifyContent="start" alignItems="start">
            {vItem.map((item) => (
              <Checkbox
                key={item.id}
                value={item.id}
                disabled={
                  displayValues.length === maxQuantity &&
                  !displayValues.includes(item.id)
                }
                onChange={(e) => handleChange(e, item)}
              >
                {item.name}
              </Checkbox>
            ))}
          </VStack>
        ))}
      </HStack>
    </CheckboxGroup>
  );
};

export default MultipleOptionalChoice;
