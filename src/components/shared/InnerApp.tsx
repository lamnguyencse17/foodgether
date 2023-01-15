import { Box, Container } from "@chakra-ui/react";
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
      <Box width="100%" height="100%">
        <Navbar />
        <Container maxW="container.xl">
          <Component {...pageProps} />
        </Container>
      </Box>
    </>
  );
};

export default InnerApp;
