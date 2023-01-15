import { useRouter } from "next/router";
import { prisma } from "../../server/db/client";
import { Photo, SharedPropsFromServer } from "../../types/shared";
import { convertObjectWithDates } from "../../utils/date";
import { AggregatedRestaurantWithStringDate } from "../../types/restaurant";
import { Box, Divider, HStack, VStack } from "@chakra-ui/react";
import { get, isEmpty } from "radash";
import Head from "next/head";
import RestaurantHeader from "../../components/restaurant/RestaurantHeader";
import { trpc } from "../../utils/trpc";
import { AggregatedDishTypesWithStringDate } from "../../types/dishTypes";
import RestaurantMenuSection from "../../components/restaurant/RestaurantMenuSection";
import RestaurantMenu from "../../components/restaurant/RestaurantMenu";
import {
  fetchShopeeMenu,
  fetchShopeeRestaurantFromId,
} from "../../server/service/shopee";
import { upsertRestaurant } from "../../server/db/restaurant";
import { updateRestaurantMenu } from "../../server/handlers/restaurant";

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

  if (!rawRestaurant) {
    const restaurantResponse = await fetchShopeeRestaurantFromId(parseInt(id));
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
        restaurant: convertObjectWithDates(
          completedRestaurant
        ) as AggregatedRestaurantWithStringDate,
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
      restaurant: convertObjectWithDates(
        restaurant
      ) as AggregatedRestaurantWithStringDate,
    },
  };
};

type RestaurantPageProps = {
  restaurant: AggregatedRestaurantWithStringDate;
};

const RestaurantPage = ({ restaurant }: RestaurantPageProps) => {
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
  const { name, address, priceRange, isAvailable, url } = confirmedRestaurant;

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
            url={url}
          />
          <Box width="full" mt={1} paddingX={4}>
            <Divider orientation="horizontal" />
          </Box>
          <HStack gap={5} width="full" paddingX={4} alignItems="flex-start">
            <RestaurantMenuSection dishTypes={dishTypes} />
            <RestaurantMenu
              dishTypes={dishTypes}
              restaurantId={confirmedRestaurant.id}
            />
          </HStack>
        </VStack>
      </main>
    </>
  );
};

export default RestaurantPage;
