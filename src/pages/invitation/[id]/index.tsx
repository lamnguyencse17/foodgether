import { useRouter } from "next/router";
import { prisma } from "../../../server/db/client";
import { Photo, SharedPropsFromServer } from "../../../types/shared";
import { AggregatedRestaurant } from "../../../types/restaurant";
import { Box, Divider, Stack, VStack } from "@chakra-ui/react";
import { get, isEmpty } from "radash";
import Head from "next/head";
import RestaurantHeader from "../../../components/invitation/RestaurantHeader";
import { AggregatedDishTypes } from "../../../types/dishTypes";
import RestaurantMenuSection from "../../../components/invitation/RestaurantMenuSection";
import RestaurantMenu from "../../../components/invitation/RestaurantMenu";
import { AggregatedInvitation } from "../../../types/invitation";
import { useTranslation } from "react-i18next";
import FloatingCart from "../../../components/invitation/FloatingCart";
import { createContext, Ref, useEffect, useMemo, useRef } from "react";
import { getAllRecentInvitationIds } from "../../../server/db/invitation";
import useStore from "../../../hooks/store";
import { trpc } from "../../../utils/trpc";
import { VirtuosoHandle } from "react-virtuoso";

export async function getStaticPaths() {
  const invitationIds = await getAllRecentInvitationIds();

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
  const invitation = await prisma.invitation.findUnique({
    where: {
      id,
    },
  });

  if (!invitation) {
    return {
      props: {
        invitation: null,
      },
    };
  }
  return {
    props: {
      invitation,
    },
  };
};

type InvitationPageProps = {
  invitation: AggregatedInvitation | null;
};

export const VirtuosoRefContext = createContext<null | Ref<VirtuosoHandle>>(
  null
);

const InvitationPage = ({ invitation }: InvitationPageProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setOptionDict, setDishDict, setCart, setRestaurant } = useStore(
    (state) => ({
      setOptionDict: state.optionDict.setOptionDict,
      setDishDict: state.dishDict.setDishDict,
      setCart: state.cart.setCart,
      setRestaurant: state.restaurant.setRestaurant,
    })
  );

  const virtuosoRef = useRef(null);

  const restaurant = invitation?.restaurant;
  const invitationId = (router.query.id ||
    router.pathname.split("/").pop()) as string;

  const confirmedRestaurant = useMemo(() => {
    return (restaurant || {}) as NonNullable<AggregatedRestaurant>;
  }, [restaurant]);

  const cartQuery = trpc.order.getMemberCurrentOrder.useQuery(
    {
      invitationId,
      restaurantId: confirmedRestaurant.id,
    },
    {
      enabled: !isEmpty(restaurant),
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (!isEmpty(cartQuery.data) && cartQuery.data) {
      setCart(cartQuery.data);
    }
  }, [cartQuery.data]);

  useEffect(() => {
    if (restaurant) {
      setOptionDict({
        restaurantId: restaurant.id,
        options: invitation.optionDict,
      });
      setDishDict({
        restaurantId: restaurant.id,
        dishes: invitation.dishDict,
      });
      setRestaurant(restaurant);
    }
  }, [confirmedRestaurant.id]);

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
            <VirtuosoRefContext.Provider value={virtuosoRef}>
              <RestaurantMenuSection dishTypes={dishTypes} />
              <RestaurantMenu
                dishTypes={dishTypes}
                restaurantId={confirmedRestaurant.id}
              />
            </VirtuosoRefContext.Provider>
          </Stack>
        </VStack>
        <FloatingCart
          invitationId={invitationId}
          previousCart={cartQuery.data}
        />
      </main>
    </>
  );
};

export default InvitationPage;
