import { Checkbox, CheckboxGroup, HStack, VStack } from "@chakra-ui/react";
import { OptionItem } from "@prisma/client";
import { cluster } from "radash";
import { ChangeEvent, FunctionComponent } from "react";
import useStore from "../../../hooks/store";
import { dishOptionValueSchema } from "../../../server/schemas/order";

type MultipleOptionalChoiceProps = {
  items: OptionItem[];
  optionId: number;
  maxQuantity: number;
};

const MultipleOptionalChoice: FunctionComponent<
  MultipleOptionalChoiceProps
> = ({ items, optionId, maxQuantity }) => {
  const { setDishOption, data } = useStore((state) => state.currentDishOption);
  const value = (data.find((option) => option.optionId === optionId)?.value ||
    []) as number[];
  const hItems = cluster(items, Math.ceil(items.length / 2));

  const handleChange = (e: ChangeEvent<HTMLInputElement>, item: OptionItem) => {
    const newValue = e.target.checked
      ? [...value, item.id]
      : value.filter((v) => v !== item.id);
    const dishOption = {
      optionId,
      mandatory: false as const,
      value: newValue,
    };
    dishOptionValueSchema.parse(dishOption);
    setDishOption(dishOption);
  };

  return (
    <CheckboxGroup value={value}>
      <HStack justifyContent="start" alignItems="start">
        {hItems.map((vItem, index) => (
          <VStack key={index} justifyContent="start" alignItems="start">
            {vItem.map((item) => (
              <Checkbox
                key={item.id}
                value={item.id}
                disabled={
                  value.length === maxQuantity && !value.includes(item.id)
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
