import {
  // Accordion,
  // AccordionButton,
  // AccordionIcon,
  // AccordionItem,
  // AccordionPanel,
  Box,
  Divider,
  VStack,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import Pusher from "pusher-js";
import { get } from "radash";
import { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import RestaurantHeader from "../../../components/managerInvitation/RestaurantHeader";
import { env } from "../../../env/client.mjs";
import { PUSHER_EVENTS } from "../../../server/common/constants";
import { getAllRecentInvitationIds, getInvitationForCreator } from "../../../server/db/invitation";
import { RestaurantWithPhotoAndPrice } from "../../../types/restaurant";
import { Photo, SharedPropsFromServer } from "../../../types/shared";

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
type InvitationOrder = NonNullable<InvitationManagerData>["orders"][0];

export const getStaticProps = async ({ params: { id } }: GetRestaurantServerParams) => {
  const invitation = await getInvitationForCreator(id);
  return {
    props: {
      invitation,
    },
    revalidate: 60,
  };
};
type ManageInvitationPageProps = {
  invitation: InvitationManagerData;
};

const ManageInvitationPage: FunctionComponent<ManageInvitationPageProps> = ({ invitation }) => {
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
    <>
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
          <VStack
            width="100%"
            height="100%"
            paddingX={4}
            alignItems={["center", "center", "flex-start"]}
            flex={1}
          >
            {/* <Accordion allowToggle width="100%">
              {orders.map((order) => (
                <AccordionItem key={order.id} width="100%">
                  <h2>
                    <AccordionButton justifyContent="space-between">
                      <Box>
                        {get(
                          invitation.members,
                          `${order.orderedById}.name`,
                          "Anonymous"
                        )}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion> */}
          </VStack>
        </VStack>
      </main>
    </>
  );
};

export default ManageInvitationPage;
