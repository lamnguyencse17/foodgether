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
import { useTranslation } from "react-i18next";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";
import { useRouter } from "next/router";

type RestaurantMenuSectionProps = {
  dishTypes: AggregatedDishTypesWithStringDate[];
};

const RestaurantMenuSection: FunctionComponent<RestaurantMenuSectionProps> = ({
  dishTypes,
}) => {
  const router = useRouter();
  const idHash = parseInt(router.asPath.split("#").pop() as string);

  const { t } = useTranslation();
  return (
    <Box width="3xs">
      <Card>
        <CardHeader>
          <Heading size="md">{t("restaurant_page.menu")}</Heading>
        </CardHeader>
        <CardBody>
          <VStack
            divider={<StackDivider />}
            spacing="4"
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            {dishTypes.map((dishType) => (
              <Box key={dishType.id}>
                <Link
                  as={NextLink}
                  href={`#${dishType.id}`}
                  color={
                    !isNaN(idHash) && idHash === dishType.id
                      ? "blue.400"
                      : undefined
                  }
                >
                  <Heading
                    size="xs"
                    textTransform="uppercase"
                    fontWeight="normal"
                  >
                    {dishType.name}
                  </Heading>
                </Link>
              </Box>
            ))}
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default RestaurantMenuSection;
