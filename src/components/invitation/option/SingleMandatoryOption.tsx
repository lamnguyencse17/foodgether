import { Select } from "@chakra-ui/react";
import { nanoid } from "nanoid/async";
import { get, isEmpty } from "radash";
import { ChangeEventHandler, FunctionComponent } from "react";
import { shallow } from "zustand/shallow";
import useStore from "../../../hooks/store";
import { dishOptionValueSchema, OptionMandatoryValue } from "../../../server/schemas/order";

type SingleMandatoryOptionProps = {
  items: number[];
  optionId: number;
  name: string;
  dishId: number;
};

const SingleMandatoryOption: FunctionComponent<SingleMandatoryOptionProps> = ({
  items,
  name,
  optionId,
  dishId,
}) => {
  const { currentOption, setDishOption, optionDict, optionItemDict } = useStore(
    (state) => ({
      currentOption: state.currentDishOption.data[
        optionId as unknown as keyof typeof state.currentDishOption.data
      ] as OptionMandatoryValue | undefined,
      setDishOption: state.currentDishOption.setDishOption,
      optionDict: state.optionDict.data,
      optionItemDict: state.optionItemDict.data.invitationPage?.optionItems || {},
    }),
    shallow,
  );
  const dict = optionDict?.options || {};
  const optionItems = items.map((id) => optionItemDict[id]!);

  const handleChangeOption: ChangeEventHandler<HTMLSelectElement> = async (e) => {
    if (isEmpty(e.target.value)) return;
    const itemPrice = get(
      dict,
      `${dishId}.${optionId}.items.${e.target.value}.price.value`,
      0,
    ) as number;
    const dishOption = {
      optionId,
      mandatory: true as const,
      value: {
        optionItemId: parseInt(e.target.value),
        id: await nanoid(20),
        price: itemPrice,
      },
      price: itemPrice,
      id: await nanoid(20),
    };
    dishOptionValueSchema.parse(dishOption);
    setDishOption(dishOption);
  };
  return (
    <Select
      placeholder={name}
      onChange={handleChangeOption}
      value={currentOption?.value?.optionItemId}
      required
    >
      {optionItems.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </Select>
  );
};

export default SingleMandatoryOption;
