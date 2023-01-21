import { listify } from "radash";
import { OptionDictOptionData } from "../hooks/store";

export const listifyOptions = (options: OptionDictOptionData) => {
  return listify(options, (_, value) => {
    return {
      ...value,
      items: listify(value.items, (_, value) => ({ ...value })),
    };
  });
};
