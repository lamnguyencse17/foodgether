import { useRouter } from "next/router";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { prisma } from "../../server/db/client";
import { Photo, SharedPropsFromServer } from "../../types/shared";
import { convertObjectWithDates } from "../../utils/date";
import { AggregatedRestaurantWithStringDate } from "../../types/restaurant";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  HStack,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { get, isEmpty } from "radash";
import Head from "next/head";
import RestaurantHeader from "../../components/restaurant/RestaurantHeader";
import { trpc } from "../../utils/trpc";
import { useTranslation } from "next-i18next";
import { AggregatedDishTypesWithStringDate } from "../../types/dishTypes";

export async function getStaticPaths() {
  const idObjectList =
    (await prisma.restaurant.findMany({
      select: { id: true },
    })) || [];

  return {
    paths: idObjectList.map(({ id }) => ({ params: { id: id.toString() } })),
    fallback: true,
  };
}

type GetRestaurantServerParams = SharedPropsFromServer & {
  params: {
    id: string;
  };
};

export const getStaticProps = async ({
  locale,
  params: { id },
}: GetRestaurantServerParams) => {
  const rawRestaurant = await prisma.restaurant.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      dishTypes: {
        include: {
          dishTypeAndDishes: {
            include: {
              dish: true,
            },
          },
        },
      },
    },
  });

  const restaurant = {
    ...rawRestaurant,
    dishTypes: rawRestaurant?.dishTypes.map((dishType) => ({
      ...dishType,
      dishes: dishType.dishTypeAndDishes.map((dish) => dish.dish),
    })),
  };

  return {
    props: {
      restaurant: convertObjectWithDates(
        restaurant
      ) as AggregatedRestaurantWithStringDate,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

type RestaurantPageProps = {
  restaurant: AggregatedRestaurantWithStringDate;
};

const RestaurantPage = ({ restaurant }: RestaurantPageProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const restaurantId = router.query.id || router.pathname.split("/").pop();
  const getRestaurantQuery = trpc.restaurant.fetchRestaurantFromId.useQuery(
    {
      id: parseInt(restaurantId as unknown as string),
    },
    {
      enabled: isEmpty(restaurant) && !isNaN(restaurantId as unknown as number),
      refetchOnWindowFocus: false,
      retryOnMount: false,
    }
  );

  const confirmedRestaurant = (restaurant ||
    getRestaurantQuery.data ||
    {}) as NonNullable<AggregatedRestaurantWithStringDate>;
  const { name, address, priceRange, isAvailable } = confirmedRestaurant;

  const restaurantPhotos = get(confirmedRestaurant, "photos", []) as Photo[];
  const restaurantHeaderImage = restaurantPhotos[restaurantPhotos.length - 1];

  const dishTypes = get(
    confirmedRestaurant,
    "dishTypes",
    []
  ) as AggregatedDishTypesWithStringDate[];

  return (
    <>
      <Head>
        <title>{name}</title>
        <meta name="description" content={name} />
      </Head>
      <main>
        <VStack width="100%">
          <RestaurantHeader
            photo={restaurantHeaderImage}
            name={name}
            address={address}
            priceRange={priceRange}
            isAvailable={isAvailable}
          />
          <Box width="full" mt={1} paddingX={4}>
            <Divider orientation="horizontal" />
          </Box>
          <HStack gap={5} width="full" paddingX={4} alignItems="flex-start">
            <Box width="3xs">
              <Card>
                <CardHeader>
                  <Heading size="md">{t("restaurant_page.menu")}</Heading>
                </CardHeader>
                <CardBody>
                  <VStack divider={<StackDivider />} spacing="4">
                    {dishTypes.map((dishType) => (
                      <Box key={dishType.id}>
                        <Heading size="xs" textTransform="uppercase">
                          {dishType.name}
                        </Heading>
                      </Box>
                    ))}
                  </VStack>
                </CardBody>
              </Card>
            </Box>

            <Box flex={1}>
              <Card>
                <CardBody>
                  <VStack divider={<StackDivider />} spacing="4">
                    {dishTypes.map((dishType) => (
                      <Box key={dishType.id} width="full">
                        <Heading size="xs" textTransform="uppercase">
                          {dishType.name}
                        </Heading>
                        <VStack divider={<StackDivider />} spacing="2">
                          {dishType.dishes.map((dish) => (
                            <Card key={dish.id} width="full">
                              <CardBody>
                                <HStack>
                                  <Text pt="2" fontSize="sm">
                                    {dish.name}
                                  </Text>
                                </HStack>
                              </CardBody>
                            </Card>
                          ))}
                        </VStack>
                      </Box>
                    ))}
                  </VStack>
                </CardBody>
              </Card>
            </Box>
          </HStack>
        </VStack>
      </main>
    </>
  );
};

export default RestaurantPage;
