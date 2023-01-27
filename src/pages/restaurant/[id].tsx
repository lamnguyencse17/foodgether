import { useRouter } from "next/router";
import { prisma } from "../../server/db/client";
import { Photo, SharedPropsFromServer } from "../../types/shared";
import { AggregatedRestaurant } from "../../types/restaurant";
import { Box, Divider, Stack, VStack } from "@chakra-ui/react";
import { get, isEmpty, objectify } from "radash";
import Head from "next/head";
import RestaurantHeader from "../../components/restaurant/RestaurantHeader";
import { trpc } from "../../utils/trpc";
import { AggregatedDishTypes } from "../../types/dishTypes";
import RestaurantMenuSection from "../../components/restaurant/RestaurantMenuSection";
import RestaurantMenu from "../../components/restaurant/RestaurantMenu";
import {
  fetchShopeeMenu,
  fetchShopeeRestaurantFromId,
} from "../../server/service/shopee";
import { upsertRestaurant } from "../../server/db/restaurant";
import { updateRestaurantMenu } from "../../server/handlers/restaurant";
import { useEffect, useMemo } from "react";
import useStore from "../../hooks/store";
import useSetOptionDict from "../../hooks/useSetOptionDict";
import useSetDishDict from "../../hooks/useSetDishDict";

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
  params: { id },
}: GetRestaurantServerParams) => {
  if (isNaN(parseInt(id)) || !id) {
    return {
      props: {
        restaurant: {},
      },
    };
  }
  try {
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

    if (!rawRestaurant) {
      const restaurantResponse = await fetchShopeeRestaurantFromId(
        parseInt(id)
      );
      await upsertRestaurant(restaurantResponse.reply.delivery_detail);
      const menu = await fetchShopeeMenu(
        restaurantResponse.reply.delivery_detail.delivery_id
      );
      const completedRestaurant = await updateRestaurantMenu(
        parseInt(id),
        menu.reply.menu_infos
      );
      return {
        props: {
          restaurant: completedRestaurant,
        },
      };
    }

    const restaurant = {
      ...rawRestaurant,
      dishTypes: rawRestaurant?.dishTypes.map((dishType) => ({
        ...dishType,
        dishes: dishType.dishTypeAndDishes.map((dish) => dish.dish),
      })),
    };

    return {
      props: {
        restaurant,
      },
    };
  } catch (err) {
    return {
      props: {
        restaurant: {},
      },
    };
  }
};

type RestaurantPageProps = {
  restaurant: AggregatedRestaurant;
};

const RestaurantPage = ({ restaurant }: RestaurantPageProps) => {
  const router = useRouter();
  const restaurantIdString =
    router.query.id || router.pathname.split("/").pop();

  const restaurantId = parseInt(restaurantIdString as unknown as string);
  const isValidRestaurantId = !isNaN(restaurantId as unknown as number);

  const shouldFetchRestaurant = isEmpty(restaurant) && isValidRestaurantId;

  const getRestaurantQuery = trpc.restaurant.fetchRestaurantFromId.useQuery(
    {
      id: restaurantId,
    },
    {
      enabled: shouldFetchRestaurant,
      refetchOnWindowFocus: false,
      retryOnMount: false,
    }
  );

  const confirmedRestaurant = useMemo(() => {
    return (
      getRestaurantQuery.data
        ? getRestaurantQuery.data
        : restaurant
        ? restaurant
        : {}
    ) as NonNullable<AggregatedRestaurant>;
  }, [getRestaurantQuery.data, restaurant]);

  useSetOptionDict(
    getRestaurantQuery.isInitialLoading && getRestaurantQuery.isFetching,
    confirmedRestaurant
  );
  useSetDishDict(confirmedRestaurant);

  const { name, address, priceRange, isAvailable, url } = confirmedRestaurant;

  const restaurantPhotos = get(confirmedRestaurant, "photos", []) as Photo[];
  const restaurantHeaderImage = restaurantPhotos[restaurantPhotos.length - 1];

  const dishTypes = get(
    confirmedRestaurant,
    "dishTypes",
    []
  ) as AggregatedDishTypes[];

  return (
    <>
      <Head>
        <title>{name}</title>
        <meta name="description" content={name} />
      </Head>
      <main style={{ width: "100%" }}>
        <VStack width="100%">
          <RestaurantHeader
            photo={restaurantHeaderImage}
            name={name}
            address={address}
            priceRange={priceRange}
            isAvailable={isAvailable}
            url={url}
            restaurantId={confirmedRestaurant.id}
          />
          <Box width="full" mt={1} paddingX={4}>
            <Divider orientation="horizontal" />
          </Box>
          <Stack
            direction={["column", "column", "row"]}
            width="100%"
            paddingX={4}
            alignItems={["center", "center", "flex-start"]}
          >
            <RestaurantMenuSection dishTypes={dishTypes} />
            <RestaurantMenu
              dishTypes={dishTypes}
              restaurantId={confirmedRestaurant.id}
            />
          </Stack>
        </VStack>
      </main>
    </>
  );
};

export default RestaurantPage;
