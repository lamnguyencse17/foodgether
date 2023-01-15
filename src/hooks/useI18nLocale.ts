import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const useI18nLocale = () => {
  const { i18n } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    i18n.changeLanguage(router.locale || "en");
  }, []);
};

export default useI18nLocale;
