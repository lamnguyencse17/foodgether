import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
} from "@chakra-ui/react";
import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  DoesRestaurantExistFromUrlParams,
  doesRestaurantExistFromUrlSchema,
} from "../server/schemas/restaurant";
import { trpc } from "../utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { env } from "../env/client.mjs";
import { AggregatedRestaurant } from "../types/restaurant";
import { useTranslation } from "next-i18next";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const Home: NextPage = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [findRestaurant, setFindRestaurant] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<DoesRestaurantExistFromUrlParams>({
    resolver: zodResolver(doesRestaurantExistFromUrlSchema),
  });

  const doesRestaurantExistQuery =
    trpc.restaurant.doesRestaurantExistFromUrl.useQuery(getValues(), {
      enabled: findRestaurant,
      onSettled: () => {
        setFindRestaurant(false);
      },
      onSuccess: async (payload) => {
        if (!payload) {
          const restaurantResponse = await fetch(
            `${env.NEXT_PUBLIC_SCRAPER_URL}/restaurants`,
            {
              method: "POST",
              body: JSON.stringify(getValues()),
              headers: {
                "content-type": "application/json",
              },
            }
          );
          const fetchedRestaurant =
            (await restaurantResponse.json()) as AggregatedRestaurant;
          router.push(`/restaurant/${fetchedRestaurant?.id}`);
          return;
        }
        router.push(`/restaurant/${payload.id}`);
      },
    });

  const onSubmit = async () => {
    setFindRestaurant(true);
  };
  const doesRestaurantAvailable =
    doesRestaurantExistQuery.isFetched && !doesRestaurantExistQuery.data;

  useEffect(() => {
    if (!doesRestaurantAvailable) {
      return;
    }
  }, [doesRestaurantAvailable]);

  return (
    <>
      <Head>
        <title>Foodgether</title>
        <meta name="description" content="Foodgether homepage" />
      </Head>
      <main>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <Box display="flex" flexDirection="row">
              <Input
                id="url"
                placeholder={t("index_page.url_input_placeholder") || ""}
                {...register("url")}
                isInvalid={!!errors["url"]?.message}
                disabled={doesRestaurantExistQuery.isFetching}
              />
              <FormErrorMessage>
                {errors.url && errors.url.message}
              </FormErrorMessage>
              <Button isLoading={isSubmitting} type="submit">
                {t("index_page.start_button")}
              </Button>
            </Box>
          </FormControl>
        </form>
        {doesRestaurantAvailable && (
          <Text>{t("index_page.waiting_for_scraper")}</Text>
        )}
      </main>
    </>
  );
};

export default Home;
