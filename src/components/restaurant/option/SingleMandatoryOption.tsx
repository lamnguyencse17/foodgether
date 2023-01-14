import { Select } from "@chakra-ui/react";
import { OptionItem } from "@prisma/client";
import { FunctionComponent } from "react";

const SingleMandatoryOption: FunctionComponent<{
  items: OptionItem[];
  name: string;
}> = ({ items, name }) => {
  return (
    <Select placeholder={name}>
      {items.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </Select>
  );
};

export default SingleMandatoryOption;
