import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import InnerApp from "../components/shared/InnerApp";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import commonEn from "../../public/locales/en/common.json";
import commonVi from "../../public/locales/vi/common.json";

i18n.use(initReactI18next).init({
  resources: {
    en: commonEn,
    vi: commonVi,
  },
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ChakraProvider>
      <SessionProvider session={session} refetchOnWindowFocus={false}>
        <InnerApp Component={Component} pageProps={pageProps} />
        <Analytics />
      </SessionProvider>
    </ChakraProvider>
  );
};

export default trpc.withTRPC(MyApp);
