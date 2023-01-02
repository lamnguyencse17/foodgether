import { Box, Container } from "@chakra-ui/react";
import { NextComponentType, NextPageContext } from "next";
import { appWithTranslation } from "next-i18next";
import Head from "next/head";
import { FunctionComponent } from "react";
import useHandleAuthenticateUser from "../../hooks/useGetUser";
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
  useHandleAuthenticateUser();
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
