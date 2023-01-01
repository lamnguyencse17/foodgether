import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import { Box, ChakraProvider, Container } from "@chakra-ui/react";
import Navbar from "../components/shared/Navbar";
import Head from "next/head";
import Favicon from "../components/shared/Favicon";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ChakraProvider>
      <SessionProvider session={session}>
        <Head>
          <Favicon />
        </Head>
        <Box width="100%" height="100%">
          <Navbar />
          <Container maxW="container.lg">
            <Component {...pageProps} />
          </Container>
        </Box>
      </SessionProvider>
    </ChakraProvider>
  );
};

export default trpc.withTRPC(MyApp);
