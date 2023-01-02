import { Box, Button, Text } from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useTranslation } from "next-i18next";

const Navbar = () => {
  const { t } = useTranslation("common");
  const { data: sessionData } = useSession();
  return (
    <Box
      width="100%"
      paddingX={6}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      paddingY={4}
    >
      <Box display="flex" flexDirection="row" alignItems="center">
        <Image src="/logo.svg" width="50" height="50" alt="Foodgether logo" />
        <Text fontSize="3xl">Foodgether</Text>
      </Box>
      <Box>
        <Button onClick={sessionData ? () => signOut() : () => signIn()}>
          {sessionData ? t("navbar.logout") : t("navbar.login")}
        </Button>
      </Box>
    </Box>
  );
};

export default Navbar;
