import { Select } from "@chakra-ui/react";
import { OptionItem } from "@prisma/client";
import { ChangeEventHandler, FunctionComponent } from "react";
import useStore from "../../../hooks/store";
import { dishOptionValueSchema } from "../../../server/schemas/order";

type SingleMandatoryOptionProps = {
  items: OptionItem[];
  optionId: number;
  name: string;
};

const SingleMandatoryOption: FunctionComponent<SingleMandatoryOptionProps> = ({
  items,
  name,
  optionId,
}) => {
  const { setDishOption } = useStore((state) => state.currentDishOption);

  const handleChangeOption: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const dishOption = {
      optionId,
      mandatory: true as const,
      value: parseInt(e.target.value),
    };
    dishOptionValueSchema.parse(dishOption);
    setDishOption(dishOption);
  };
  return (
    <Select placeholder={name} onChange={handleChangeOption}>
      {items.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </Select>
  );
};

export default SingleMandatoryOption;
