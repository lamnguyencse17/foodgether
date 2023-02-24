import { Checkbox, HStack, VStack } from "@chakra-ui/react";
import { InvitationOptionItem } from "@prisma/client";
import { nanoid } from "nanoid";
import { cluster, get, objectify, toggle, uid } from "radash";
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
  const { currentOptionItems, setDishOption, optionItemDict } = useStore(
    (state) => ({
      currentOptionItems: [
        state.currentDishOption.data[
          optionId as unknown as keyof typeof state.currentDishOption.data
        ]?.value || [],
      ].flat(),
      setDishOption: state.currentDishOption.setDishOption,
      optionItemDict: state.optionItemDict.data.invitationPage?.optionItems || {},
    }),
    shallow,
  );

  const isIncluded = useMemo(
    () => currentOptionItems.some((optionItem) => optionItem.optionItemId === item.id),
    [currentOptionItems.length],
  );

  const handleChange = useCallback(
    (_: ChangeEvent<HTMLInputElement>) => {
      const newOption = toggle(
        currentOptionItems,
        {
          id: generatedId,
          price: get(optionItemDict, `${item.id}.price.value`, 0) as number,
          optionItemId: item.id!,
        },
        (optionItem) => optionItem.optionItemId,
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
    [dishId, optionId, currentOptionItems],
  );

  const disabled = useMemo(() => {
    return currentOptionItems.length === maxQuantity && !isIncluded;
  }, [currentOptionItems.length]);

  return (
    <Checkbox disabled={disabled} onChange={handleChange} isChecked={isIncluded}>
      {item.name}
    </Checkbox>
  );
};

type MultipleOptionalChoiceProps = {
  optionItemIdList: number[];
  optionId: number;
  maxQuantity: number;
  dishId: number;
};

const MultipleOptionalChoice: FunctionComponent<MultipleOptionalChoiceProps> = ({
  optionItemIdList,
  optionId,
  maxQuantity,
  dishId,
}) => {
  const { optionDict, optionItemDict } = useStore(
    (state) => ({
      currentOption:
        state.currentDishOption.data[
          optionId as unknown as keyof typeof state.currentDishOption.data
        ],
      optionDict: state.optionDict.dataV2.invitationPage?.options || {},
      optionItemDict: state.optionItemDict.data.invitationPage?.optionItems || {},
    }),
    shallow,
  );
  const optionItems = useMemo(
    () =>
      optionItemIdList.reduce((acc, cur) => {
        const optionItem = optionItemDict[cur];
        if (optionItem) {
          acc.push(optionItem);
        }
        return acc;
      }, [] as InvitationOptionItem[]),
    [],
  );
  const hItems = useMemo(
    () => cluster(optionItems, Math.ceil(optionItems.length / 2)),
    [optionItems.length],
  );
  const idMap = useMemo(() => {
    return objectify(
      optionItemIdList,
      (item) => item,
      () => nanoid(20),
    );
  }, [optionDict]);

  return (
    <HStack justifyContent="start" alignItems="start" width="100%">
      {hItems.map((vItem) => (
        <VStack key={uid(3)} justifyContent="start" alignItems="start">
          {vItem.map((item) => (
            <MultipleChoice
              key={item.id}
              dishId={dishId}
              generatedId={idMap[item.id as unknown as keyof typeof idMap]!}
              item={item}
              optionId={optionId}
              maxQuantity={maxQuantity}
            />
          ))}
        </VStack>
      ))}
    </HStack>
  );
};

export default MultipleOptionalChoice;
