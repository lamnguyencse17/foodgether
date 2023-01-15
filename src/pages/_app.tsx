import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import InnerApp from "../components/shared/InnerApp";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import commonEn from "../../public/locales/en/common.json";
import commonVi from "../../public/locales/vi/common.json";

i18n.use(initReactI18next).init({
  // the translations
  // (tip move them in a JSON file and import them,
  // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
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
      <SessionProvider session={session}>
        <InnerApp Component={Component} pageProps={pageProps} />
      </SessionProvider>
    </ChakraProvider>
  );
};

export default trpc.withTRPC(MyApp);
