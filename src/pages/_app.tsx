import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import InnerApp from "../components/shared/InnerApp";
import { appWithTranslation } from "next-i18next";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ChakraProvider>
      <SessionProvider session={session}>
        <InnerApp Component={Component} pageProps={pageProps} />
      </SessionProvider>
    </ChakraProvider>
  );
};

export default trpc.withTRPC(appWithTranslation(MyApp));
