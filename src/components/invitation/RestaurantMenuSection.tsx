import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Skeleton,
  Stack,
  StackDivider,
} from "@chakra-ui/react";
import { FunctionComponent, useContext } from "react";
import { AggregatedDishTypes } from "../../types/dishTypes";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { isEmpty } from "radash";
import { VirtuosoRefContext } from "../../pages/invitation/[id]";

type RestaurantMenuSectionProps = {
  dishTypes: AggregatedDishTypes[];
};

const RestaurantMenuSection: FunctionComponent<RestaurantMenuSectionProps> = ({
  dishTypes,
}) => {
  const router = useRouter();
  const idHash = parseInt(router.asPath.split("#").pop() as string);
  const virtuosoRef = useContext(VirtuosoRefContext);

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
            width="100%"
          >
            {!isEmpty(dishTypes) ? (
              dishTypes.map((dishType) => (
                <Button
                  variant="link"
                  key={dishType.id}
                  whiteSpace="normal"
                  textAlign="left"
                  onClick={() => {
                    if (virtuosoRef && virtuosoRef.current) {
                      virtuosoRef.current.scrollToIndex({
                        index: dishType.id,
                      });
                      router.push(`#${dishType.id}`);
                    }
                  }}
                  //TODO: Hydration error can happen when url have hash
                  textColor={
                    !isNaN(idHash) && idHash === dishType.id
                      ? "blue.400"
                      : undefined
                  }
                >
                  {dishType.name}
                </Button>
              ))
            ) : (
              <Skeleton height="6" width="36" />
            )}
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default RestaurantMenuSection;
