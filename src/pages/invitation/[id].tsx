import { useRouter } from "next/router";
import { prisma } from "../../server/db/client";
import { Photo, SharedPropsFromServer } from "../../types/shared";
import { convertObjectWithDates } from "../../utils/date";
import { AggregatedRestaurantWithStringDate } from "../../types/restaurant";
import { Box, Divider, HStack, Stack, VStack } from "@chakra-ui/react";
import { get } from "radash";
import Head from "next/head";
import RestaurantHeader from "../../components/invitation/RestaurantHeader";
import { AggregatedDishTypesWithStringDate } from "../../types/dishTypes";
import RestaurantMenuSection from "../../components/invitation/RestaurantMenuSection";
import RestaurantMenu from "../../components/invitation/RestaurantMenu";
import { AggregatedInvitationWithStringDate } from "../../types/invitation";
import { useTranslation } from "react-i18next";
import FloatingCart from "../../components/invitation/FloatingCart";

export async function getStaticPaths() {
  const idObjectList =
    (await prisma.invitation.findMany({
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
  const rawInvitation = await prisma.invitation.findUnique({
    where: {
      id,
    },
    include: {
      restaurant: {
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
      },
      createdBy: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!rawInvitation) {
    return {
      props: {
        invitation: null,
      },
    };
  }
  const invitation = convertObjectWithDates({
    ...rawInvitation,
    restaurant: {
      ...rawInvitation.restaurant,
      dishTypes: rawInvitation.restaurant?.dishTypes.map((dishType) => ({
        ...dishType,
        dishes: dishType.dishTypeAndDishes.map((dish) => dish.dish),
      })),
    },
  });
  return {
    props: {
      invitation,
    },
  };
};

type InvitationPageProps = {
  invitation: AggregatedInvitationWithStringDate | null;
};

const RestaurantPage = ({ invitation }: InvitationPageProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const restaurant = invitation?.restaurant;
  const invitationId = (router.query.id ||
    router.pathname.split("/").pop()) as string;

  const confirmedRestaurant = (restaurant ||
    {}) as NonNullable<AggregatedRestaurantWithStringDate>;
  const { name, address, priceRange, isAvailable, url } = confirmedRestaurant;

  const restaurantPhotos = get(confirmedRestaurant, "photos", []) as Photo[];
  const restaurantHeaderImage = restaurantPhotos[restaurantPhotos.length - 1];

  const dishTypes = get(
    confirmedRestaurant,
    "dishTypes",
    []
  ) as AggregatedDishTypesWithStringDate[];
  const description = t("invitation_page.invitation_description", {
    name,
  }) as string;
  return (
    <>
      <Head>
        <title>{description}</title>
        <meta name="description" content={description} />
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
            invitationId={invitationId}
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
        <FloatingCart />
      </main>
    </>
  );
};

export default RestaurantPage;
