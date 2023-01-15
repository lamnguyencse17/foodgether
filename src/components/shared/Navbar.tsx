import { Box, Button, Text } from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import NextLink from "next/link";
import { LinkBox, LinkOverlay } from "@chakra-ui/react";

const Navbar = () => {
  const { t } = useTranslation();
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
      <LinkBox display="flex" flexDirection="row" alignItems="center">
        <LinkOverlay display="flex" flexDirection="row" as={NextLink} href="/">
          <Image src="/logo.svg" width="50" height="50" alt="Foodgether logo" />
          <Text fontSize="3xl">Foodgether</Text>
        </LinkOverlay>
      </LinkBox>
      <Box>
        <Button onClick={sessionData ? () => signOut() : () => signIn()}>
          {sessionData ? t("navbar.logout") : t("navbar.login")}
        </Button>
      </Box>
    </Box>
  );
};

export default Navbar;
