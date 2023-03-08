import { Box, Divider, VStack } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import Pusher from "pusher-js";
import { get, flat, objectify } from "radash";
import { createContext, FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import RestaurantHeader from "../../../components/managerInvitation/RestaurantHeader";
import { env } from "../../../env/client.mjs";
import { PUSHER_EVENTS } from "../../../server/common/constants";
import { getAllRecentInvitationIds, getInvitationForCreator } from "../../../server/db/invitation";
import { RestaurantWithPhotoAndPrice } from "../../../types/restaurant";
import { Photo, SharedPropsFromServer } from "../../../types/shared";
import { ManageInvitaionContainer } from "../../../containers/manageInvitationContainer/ManageInvitaionContainer";

export const ManageContext = createContext<{
  selectedDishes: { [key: string]: SelectedDishes } | null;
  invitationOptions?: { [key: string]: InvitationOptions } | null;
}>({ selectedDishes: null, invitationOptions: null });

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

type InvitationManagerData = Awaited<ReturnType<typeof getInvitationForCreator>>;
export type InvitationOrder = NonNullable<InvitationManagerData>["orders"][0];
export type SelectedDishes = NonNullable<
  NonNullable<InvitationManagerData>["invitationRestaurant"]
>["invitationDishes"][0];
export type InvitationOptions = NonNullable<
  NonNullable<InvitationManagerData>["invitationRestaurant"]
>["invitationOptions"][0];

export const getStaticProps = async ({ params: { id } }: GetRestaurantServerParams) => {
  const invitation = await getInvitationForCreator(id);
  const orderDishIds =
    invitation?.orders &&
    flat(
      invitation.orders.map((order) =>
        order.orderDishes.map((orderDish) => orderDish.invitationDishId),
      ),
    );

  const invitationDishes = invitation?.invitationRestaurant?.invitationDishes;

  const selectedDishes = invitationDishes?.filter((dish) => orderDishIds?.includes(dish.id));

  return {
    props: {
      selectedDishes: objectify(selectedDishes || [], (dish) => dish.id),
      invitation,
    },
    revalidate: 60,
  };
};
type ManageInvitationPageProps = {
  invitation: InvitationManagerData;
  selectedDishes: { [key: string]: SelectedDishes };
};

const ManageInvitationPage: FunctionComponent<ManageInvitationPageProps> = ({
  invitation,
  selectedDishes,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const invitationId = (router.query.id || router.pathname.split("/").pop()) as string;
  const restaurant = ((invitation || {}).invitationRestaurant || {}) as RestaurantWithPhotoAndPrice;

  const [orders, setOrder] = useState((invitation || {}).orders || []);
  const [pusher, setPusher] = useState<Pusher | null>();

  const { name, address, priceRange, isAvailable, url } = restaurant;

  const restaurantPhotos = get(restaurant, "photos", []) as Photo[];
  const restaurantHeaderImage = restaurantPhotos[restaurantPhotos.length - 1];

  const description = t("invitation_manage_page.invitation_description", {
    name,
  }) as string;

  useEffect(() => {
    if (typeof window === "undefined") return;
    console.log(`Subscribe to channel ${invitationId}`);
    const createdPusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });
    setPusher(createdPusher);
    const channel = createdPusher.subscribe(invitationId);
    channel.bind(PUSHER_EVENTS.ORDER_UPDATE, (updatedOrder: InvitationOrder) => {
      setOrder((orders) =>
        orders.map((order) => {
          if (order.orderedById === updatedOrder.orderedById) {
            return updatedOrder;
          }
          return order;
        }),
      );
    });
    return () => {
      if (pusher) {
        pusher.disconnect();
        setPusher(null);
      }
    };
  }, []);

  return (
    <ManageContext.Provider
      value={{
        selectedDishes,
        invitationOptions: objectify(
          invitation?.invitationRestaurant?.invitationOptions || [],
          (option) => option.id,
        ),
      }}
    >
      <Head>
        <title>{description}</title>
        <meta name="description" content={description} />
      </Head>
      <main style={{ width: "100%", height: "100%" }}>
        <VStack width="100%">
          <RestaurantHeader
            photo={restaurantHeaderImage}
            name={name}
            address={address}
            priceRange={priceRange}
            isAvailable={isAvailable}
            url={url}
            restaurantId={restaurant.id}
            invitationId={invitationId}
          />
          <Box width="full" mt={1} paddingX={4}>
            <Divider orientation="horizontal" />
          </Box>
          <ManageInvitaionContainer orders={orders} />
        </VStack>
      </main>
    </ManageContext.Provider>
  );
};

export default ManageInvitationPage;
