import { useRouter } from "next/router";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { prisma } from "../../server/db/client";
import { Photo, SharedPropsFromServer } from "../../types/shared";
import { convertObjectWithDates } from "../../utils/date";
import { AggregatedRestaurantWithStringDate } from "../../types/restaurant";
import { Box } from "@chakra-ui/react";
import { get } from "radash";
import Head from "next/head";
import RestaurantHeader from "../../components/restaurant/RestaurantHeader";
import { trpc } from "../../utils/trpc";

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
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      dishTypes: {
        include: {
          dishes: true,
        },
      },
    },
  });

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
  const router = useRouter();
  const getRestaurantQuery = trpc.restaurant.fetchRestaurantFromId.useQuery(
    {
      id: parseInt(router.query.id as unknown as string),
    },
    {
      enabled: !restaurant,
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

  return (
    <>
      <Head>
        <title>{name}</title>
        <meta name="description" content={name} />
      </Head>
      <main>
        <Box
          maxH="xs"
          display="flex"
          flexDirection={["column", "row", "row"]}
          gap={10}
          padding={4}
        >
          <RestaurantHeader
            photo={restaurantHeaderImage}
            name={name}
            address={address}
            priceRange={priceRange}
            isAvailable={isAvailable}
          />
        </Box>
      </main>
    </>
  );
};

export default RestaurantPage;
