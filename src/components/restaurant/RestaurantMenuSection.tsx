import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  StackDivider,
  VStack,
} from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { AggregatedDishTypesWithStringDate } from "../../types/dishTypes";
import { useTranslation } from "next-i18next";

type RestaurantMenuSectionProps = {
  dishTypes: AggregatedDishTypesWithStringDate[];
};

const RestaurantMenuSection: FunctionComponent<RestaurantMenuSectionProps> = ({
  dishTypes,
}) => {
  const { t } = useTranslation("common");
  return (
    <Box width="3xs">
      <Card>
        <CardHeader>
          <Heading size="md">{t("restaurant_page.menu")}</Heading>
        </CardHeader>
        <CardBody>
          <VStack divider={<StackDivider />} spacing="4">
            {dishTypes.map((dishType) => (
              <Box key={dishType.id}>
                <Heading
                  size="xs"
                  textTransform="uppercase"
                  fontWeight="normal"
                >
                  {dishType.name}
                </Heading>
              </Box>
            ))}
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default RestaurantMenuSection;
