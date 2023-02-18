import { Checkbox, CheckboxGroup, HStack, VStack } from "@chakra-ui/react";
import { InvitationOptionItem } from "@prisma/client";
import { nanoid } from "nanoid";
import { cluster, get, mapValues, toggle, uid } from "radash";
import { ChangeEvent, FunctionComponent, useCallback, useMemo } from "react";
import { shallow } from "zustand/shallow";
import useStore from "../../../hooks/store";
import { dishOptionValueSchema } from "../../../server/schemas/order";

type MultipleChoiceProps = {
  dishId: number;
  generatedId: string;
  item: InvitationOptionItem;
  optionId: number;
  maxQuantity: number;
};

const MultipleChoice: FunctionComponent<MultipleChoiceProps> = ({
  dishId,
  generatedId,
  item,
  optionId,
  maxQuantity,
}) => {
  const { currentOptionItems, setDishOption, optionDict } = useStore(
    (state) => ({
      currentOptionItems: [
        state.currentDishOption.data[
          optionId as unknown as keyof typeof state.currentDishOption.data
        ]?.value || [],
      ].flat(),
      setDishOption: state.currentDishOption.setDishOption,
      optionDict: state.optionDict.dataV2.invitationPage,
    }),
    shallow
  );

  const isIncluded = currentOptionItems.some(
    (optionItem) => optionItem.optionItemId === item.id
  );

  const handleChange = useCallback(
    async (_: ChangeEvent<HTMLInputElement>, item: InvitationOptionItem) => {
      const newOption = toggle(
        currentOptionItems,
        {
          id: generatedId,
          price: get(
            optionDict,
            `${dishId}.${optionId}.invitationOptionItems.${item.id}.price.value`,
            0
          ) as number,
          optionItemId: item.id,
        },
        (optionItem) => optionItem.id
      );
      const dishOption = {
        optionId,
        mandatory: false as const,
        value: newOption,
        price: newOption.reduce((acc, v) => acc + v.price, 0),
        id: nanoid(20),
      };
      dishOptionValueSchema.parse(dishOption);
      setDishOption(dishOption);
    },
    [dishId, optionId, currentOptionItems]
  );

  const disabled = useMemo(() => {
    return currentOptionItems.length === maxQuantity && !isIncluded;
  }, [currentOptionItems.length]);

  return (
    <Checkbox
      key={item.id}
      value={item.id}
      disabled={disabled}
      onChange={(e) => handleChange(e, item)}
    >
      {item.name}
    </Checkbox>
  );
};

type MultipleOptionalChoiceProps = {
  items: InvitationOptionItem[];
  optionId: number;
  maxQuantity: number;
  dishId: number;
};

const MultipleOptionalChoice: FunctionComponent<
  MultipleOptionalChoiceProps
> = ({ items, optionId, maxQuantity, dishId }) => {
  const { currentOption, optionDict } = useStore(
    (state) => ({
      currentOption:
        state.currentDishOption.data[
          optionId as unknown as keyof typeof state.currentDishOption.data
        ],
      optionDict: state.optionDict.dataV2.invitationPage,
    }),
    shallow
  );

  const dict = optionDict?.options || {};
  const optionItems = [currentOption?.value || []].flat();
  const hItems = cluster(items, Math.ceil(items.length / 2));
  const idMap = useMemo(() => {
    return mapValues(
      get(dict, `${dishId}.${optionId}.invitationOptionItems`, {}) || {},
      () => nanoid(20)
    );
  }, [dict]);

  const displayValues = optionItems.map((v) => v.optionItemId);

  return (
    <CheckboxGroup value={displayValues}>
      <HStack justifyContent="start" alignItems="start" width="100%">
        {hItems.map((vItem) => (
          <VStack key={uid(3)} justifyContent="start" alignItems="start">
            {vItem.map((item) => (
              <MultipleChoice
                key={item.id}
                dishId={dishId}
                generatedId={idMap[item.id as unknown as keyof typeof idMap]}
                item={item}
                optionId={optionId}
                maxQuantity={maxQuantity}
              />
            ))}
          </VStack>
        ))}
      </HStack>
    </CheckboxGroup>
  );
};

export default MultipleOptionalChoice;
