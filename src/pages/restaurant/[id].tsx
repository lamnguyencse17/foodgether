import { useRouter } from "next/router";
import { prisma } from "../../server/db/client";
import { Photo, SharedPropsFromServer } from "../../types/shared";
import { AggregatedRestaurant } from "../../types/restaurant";
import { Box, Divider, Stack, VStack } from "@chakra-ui/react";
import { get, isEmpty } from "radash";
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
import {
  getAggregatedRestaurant,
  upsertRestaurant,
} from "../../server/db/restaurant";
import { updateRestaurantMenu } from "../../server/handlers/restaurant";
import { createContext, RefObject, useEffect, useMemo, useRef } from "react";
import useSetOptionDict from "../../hooks/useSetOptionDict";
import useSetDishDict from "../../hooks/useSetDishDict";
import { formatISO, sub } from "date-fns";
import useStore from "../../hooks/store";
import { VirtuosoHandle } from "react-virtuoso";

export async function getStaticPaths() {
  const idObjectList =
    (await prisma.restaurant.findMany({
      select: { id: true },
      where: {
        createdAt: {
          gte: formatISO(sub(new Date(), { days: 1 })),
        },
      },
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
    const restaurant = await getAggregatedRestaurant(prisma, parseInt(id));

    if (!restaurant) {
      const restaurantResponse = await fetchShopeeRestaurantFromId(
        parseInt(id)
      );
      await upsertRestaurant(prisma, restaurantResponse.reply.delivery_detail);
      const menu = await fetchShopeeMenu(
        restaurantResponse.reply.delivery_detail.delivery_id
      );
      const completedRestaurant = await updateRestaurantMenu(
        prisma,
        parseInt(id),
        menu.reply.menu_infos
      );
      return {
        props: {
          restaurant: await getAggregatedRestaurant(
            prisma,
            completedRestaurant
          ),
        },
      };
    }

    return {
      props: {
        restaurant,
      },
      revalidate: 60,
    };
  } catch (err) {
    return {
      props: {
        restaurant: {},
      },
      revalidate: 60,
    };
  }
};

type RestaurantPageProps = {
  restaurant: AggregatedRestaurant;
};

export const VirtuosoRefContext =
  createContext<null | RefObject<VirtuosoHandle>>(null);

const RestaurantPage = ({ restaurant }: RestaurantPageProps) => {
  const { setRestaurant } = useStore((state) => ({
    setRestaurant: state.restaurant.setRestaurant,
  }));
  const router = useRouter();
  const restaurantIdString =
    router.query.id || router.pathname.split("/").pop();
  const virtuosoRef = useRef(null);
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

  useEffect(() => {
    if (!isEmpty(confirmedRestaurant)) {
      setRestaurant(confirmedRestaurant);
    }
  }, []);

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
            <VirtuosoRefContext.Provider value={virtuosoRef}>
              <RestaurantMenuSection dishTypes={dishTypes} />
              <RestaurantMenu
                dishTypes={dishTypes}
                restaurantId={confirmedRestaurant.id}
              />
            </VirtuosoRefContext.Provider>
          </Stack>
        </VStack>
      </main>
    </>
  );
};

export default RestaurantPage;
