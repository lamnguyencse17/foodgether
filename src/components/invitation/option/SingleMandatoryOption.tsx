import { Select } from "@chakra-ui/react";
import { OptionItem } from "@prisma/client";
import { ChangeEventHandler, FunctionComponent } from "react";
import useStore from "../../../hooks/store";

type SingleMandatoryOptionProps = {
  items: OptionItem[];
  dishTypeId: number;
  name: string;
};

const SingleMandatoryOption: FunctionComponent<SingleMandatoryOptionProps> = ({
  items,
  name,
  dishTypeId,
}) => {
  const { setDishOption } = useStore((state) => state.currentDishOption);

  const handleChangeOption: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setDishOption({
      dishTypeId,
      mandatory: true,
      value: parseInt(e.target.value),
    });
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
