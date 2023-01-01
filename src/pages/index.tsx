import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Input,
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

const Home: NextPage = () => {
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
    });

  const onSubmit = () => {
    setFindRestaurant(true);
  };

  useEffect(() => {
    console.log(doesRestaurantExistQuery.data);
  }, [doesRestaurantExistQuery.data]);

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
                placeholder="Your Shopee Food URL"
                {...register("url")}
                isInvalid={!!errors["url"]?.message}
                disabled={doesRestaurantExistQuery.isFetching}
              />
              <FormErrorMessage>
                {errors.url && errors.url.message}
              </FormErrorMessage>
              <Button isLoading={isSubmitting} type="submit">
                Go
              </Button>
            </Box>
          </FormControl>
        </form>
      </main>
    </>
  );
};

export default Home;
