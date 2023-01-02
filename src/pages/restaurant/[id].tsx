import { useRouter } from "next/router";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { prisma } from "../../server/db/client";
import { Photo, SharedPropsFromServer } from "../../types/shared";
import { convertObjectWithDates } from "../../utils/date";
import { AggregatedRestaurantWithStringDate } from "../../types/restaurant";
import { Box } from "@chakra-ui/react";
import Image from "next/image";
import { get } from "radash";
import { useTranslation } from "react-i18next";

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
  console.log(restaurant);
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

  const confirmedRestaurant =
    restaurant as NonNullable<AggregatedRestaurantWithStringDate>;

  const restaurantPhotos = get(confirmedRestaurant, "photos", []) as Photo[];
  const restaurantHeaderImage = restaurantPhotos[
    restaurantPhotos.length - 1
  ] as Photo;

  return (
    <main>
      <Box
        maxH="xs"
        display="flex"
        flexDirection={["column", "row", "row"]}
        gap={5}
        padding={4}
      >
        <Box maxH={["100%", "2xs", "3xs"]} maxW={["100%", "sm", "md"]}>
          <Image
            src={restaurantHeaderImage.value}
            height={restaurantHeaderImage.height}
            width={restaurantHeaderImage.width}
            alt={t("restaurant_page.cover_photo", {
              name: confirmedRestaurant.name,
            })}
            style={{
              objectFit: "scale-down",
            }}
          />
        </Box>

        <Box flex={1}>{restaurant?.name}</Box>
      </Box>
    </main>
  );
};

export default RestaurantPage;
