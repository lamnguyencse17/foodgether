import { Select } from "@chakra-ui/react";
import { ChangeEventHandler } from "react";

interface SingleMandatorySelectProps {
  value: number;
  options: { id: number; name: string }[];
  onChangeOption: ChangeEventHandler<HTMLSelectElement>;
}

export const SingleMandatorySelect = (props: SingleMandatorySelectProps) => {
  const { value, options, onChangeOption } = props;
  return (
    <Select placeholder={"Select"} onChange={onChangeOption} value={value} required>
      {options.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </Select>
  );
};
