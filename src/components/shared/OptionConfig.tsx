import { Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

interface OptionConfigProps {
  name: string;
  maxQuantity: number;
  isMandatory: boolean;
}
export const OptionConfig = (props: OptionConfigProps) => {
  const { name, maxQuantity, isMandatory } = props;
  const { t } = useTranslation();

  const optionConfig = isMandatory
    ? t("invitation_page.mandatory_choice", {
        amount: maxQuantity,
      })
    : t("invitation_page.optional_choice", {
        amount: maxQuantity,
      });

  return (
    <Heading size="sm" marginBottom={3}>
      {name} {optionConfig}
      {isMandatory && "*"}
    </Heading>
  );
};
