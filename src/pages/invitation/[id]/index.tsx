import { useRouter } from "next/router";
import { prisma } from "../../../server/db/client";
import { Photo, SharedPropsFromServer } from "../../../types/shared";
import { AggregatedRestaurant } from "../../../types/restaurant";
import { Box, Divider, Stack, VStack } from "@chakra-ui/react";
import { get } from "radash";
import Head from "next/head";
import RestaurantHeader from "../../../components/invitation/RestaurantHeader";
import { AggregatedDishTypes } from "../../../types/dishTypes";
import RestaurantMenuSection from "../../../components/invitation/RestaurantMenuSection";
import RestaurantMenu from "../../../components/invitation/RestaurantMenu";
import { AggregatedInvitation } from "../../../types/invitation";
import { useTranslation } from "react-i18next";
import FloatingCart from "../../../components/invitation/FloatingCart";
import { useMemo } from "react";
import { getAllInvitationIds } from "../../../server/db/invitation";
import useSetOptionDict from "../../../hooks/useSetOptionDict";
import useSetDishDict from "../../../hooks/useSetDishDict";

export async function getStaticPaths() {
  const invitationIds = await getAllInvitationIds();

  return {
    paths: invitationIds.map((id) => ({ params: { id } })),
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
  const invitation = {
    ...rawInvitation,
    restaurant: {
      ...rawInvitation.restaurant,
      dishTypes: rawInvitation.restaurant?.dishTypes.map((dishType) => ({
        ...dishType,
        dishes: dishType.dishTypeAndDishes.map((dish) => dish.dish),
      })),
    },
  };
  return {
    props: {
      invitation,
    },
  };
};

type InvitationPageProps = {
  invitation: AggregatedInvitation | null;
};

const RestaurantPage = ({ invitation }: InvitationPageProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const restaurant = invitation?.restaurant;
  const invitationId = (router.query.id ||
    router.pathname.split("/").pop()) as string;

  const confirmedRestaurant = useMemo(() => {
    return (restaurant || {}) as NonNullable<AggregatedRestaurant>;
  }, [restaurant]);

  useSetOptionDict(restaurant);
  useSetDishDict(restaurant);

  const { name, address, priceRange, isAvailable, url } =
    confirmedRestaurant || {};

  const restaurantPhotos = get(confirmedRestaurant, "photos", []) as Photo[];
  const restaurantHeaderImage = restaurantPhotos[restaurantPhotos.length - 1];

  const dishTypes = get(
    confirmedRestaurant,
    "dishTypes",
    []
  ) as AggregatedDishTypes[];
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
