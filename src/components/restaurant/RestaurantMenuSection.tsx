import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  StackDivider,
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
    <Box maxW={["100%", "100%", "3xs"]} overflowX="auto">
      <Card>
        <CardHeader>
          <Heading size="md">{t("invitation_page.menu")}</Heading>
        </CardHeader>
        <CardBody>
          <Stack
            divider={<StackDivider />}
            spacing="4"
            justifyContent="flex-start"
            alignItems="flex-start"
            direction={["row", "row", "column"]}
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
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default RestaurantMenuSection;
