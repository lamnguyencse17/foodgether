import { Box, Container, VStack } from "@chakra-ui/react";
import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";
import { FunctionComponent } from "react";
import { useDisplayToast } from "../../hooks/useDisplayToast";
import useHandleAuthenticateUser from "../../hooks/useGetUser";
import useI18nLocale from "../../hooks/useI18nLocale";
import Favicon from "./Favicon";
import Navbar from "./Navbar";

type InnerAppProps = {
  Component: NextComponentType<NextPageContext, any, any>;
  pageProps: Record<string, any>;
};

const InnerApp: FunctionComponent<InnerAppProps> = ({
  Component,
  pageProps,
}) => {
  useI18nLocale();
  useHandleAuthenticateUser();
  useDisplayToast();
  return (
    <>
      <Head>
        <Favicon />
      </Head>
      <VStack width="100%" height="100%">
        <Navbar />
        <Container maxW="container.xl">
          <VStack>
            <Component {...pageProps} />
          </VStack>
        </Container>
      </VStack>
    </>
  );
};

export default InnerApp;
