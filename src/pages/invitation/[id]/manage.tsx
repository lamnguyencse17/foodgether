import { VStack } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { get } from "radash";
import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import RestaurantHeader from "../../../components/managerInvitation/RestaurantHeader";
import {
  getAllRecentInvitationIds,
  getInvitationForCreator,
} from "../../../server/db/invitation";
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

export const getStaticProps = async ({
  params: { id },
}: GetRestaurantServerParams) => {
  const invitation = await getInvitationForCreator(id);
  return {
    props: {
      invitation,
    },
    revalidate: 60,
  };
};
type ManageInvitationPageProps = {
  invitation: Awaited<ReturnType<typeof getInvitationForCreator>>;
};

const ManageInvitationPage: FunctionComponent<ManageInvitationPageProps> = ({
  invitation,
}) => {
  console.log(invitation);
  const { t } = useTranslation();
  const router = useRouter();
  const invitationId = (router.query.id ||
    router.pathname.split("/").pop()) as string;
  const restaurant = ((invitation || {}).restaurant ||
    {}) as RestaurantWithPhotoAndPrice;

  const { name, address, priceRange, isAvailable, url } = restaurant;

  const restaurantPhotos = get(restaurant, "photos", []) as Photo[];
  const restaurantHeaderImage = restaurantPhotos[restaurantPhotos.length - 1];

  const description = t("invitation_manage_page.invitation_description", {
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
            restaurantId={restaurant.id}
            invitationId={invitationId}
          />
        </VStack>
      </main>
    </>
  );
};

export default ManageInvitationPage;
