import { Checkbox, CheckboxGroup, HStack, VStack } from "@chakra-ui/react";
import { OptionItem } from "@prisma/client";
import { cluster, uid } from "radash";
import { FunctionComponent, useState } from "react";

const MultipleOptionalChoice: FunctionComponent<{ items: OptionItem[] }> = ({ items }) => {
  const [value, setValue] = useState<number[]>([]);
  const hItems = cluster(items, Math.ceil(items.length / 2));
  return (
    <CheckboxGroup value={value}>
      <HStack justifyContent="start" alignItems="start">
        {hItems.map((vItem) => (
          <VStack key={uid(4)} justifyContent="start" alignItems="start">
            {vItem.map((item) => (
              <Checkbox
                key={item.id}
                value={item.id}
                onChange={(e) => {
                  e.target.checked
                    ? setValue([...value, item.id])
                    : setValue(value.filter((v) => v !== item.id));
                }}
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
