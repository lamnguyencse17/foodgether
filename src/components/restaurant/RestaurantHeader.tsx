import { Box, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import Image from "next/image";
import { FunctionComponent } from "react";
import { Photo } from "../../types/shared";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { ExternalLinkIcon } from "@chakra-ui/icons";

type RestaurantHeaderProps = {
  photo?: Photo;
  name: string;
  address: string;
  isAvailable: boolean;
  priceRange: {
    minPrice: number;
    maxPrice: number;
  };
  url: string;
};

const RestaurantHeader: FunctionComponent<RestaurantHeaderProps> = ({
  photo,
  name = "",
  address = "",
  isAvailable = false,
  priceRange,
  url = "",
}) => {
  const { t } = useTranslation();
  return (
    <Box
      maxH="xs"
      display="flex"
      flexDirection={["column", "row", "row"]}
      gap={10}
      padding={4}
    >
      <Box maxH={["100%", "2xs", "3xs"]} maxW={["100%", "sm", "md"]}>
        {photo && (
          <Image
            src={photo.value}
            height={photo.height}
            width={photo.width}
            alt={t("restaurant_page.cover_photo", {
              name: name,
            })}
            style={{
              objectFit: "scale-down",
            }}
            priority={true}
          />
        )}
      </Box>

      <VStack flex={1} alignItems="flex-start">
        <Heading>
          <Link href={url} target="_blank">
            <Box alignItems="center" justifyContent="center">
              {name} <ExternalLinkIcon pb={1} />
            </Box>
          </Link>
        </Heading>

        <Text>{address}</Text>
        <HStack justifyContent="center" alignItems="center">
          <Image
            src={isAvailable ? "/open.svg" : "/closed.svg"}
            width={30}
            height={30}
            alt={
              isAvailable
                ? t("restaurant_page.is_open")
                : t("restaurant_page.is_closed")
            }
          />
          <Text textColor={isAvailable ? "green" : "red"}>
            {isAvailable
              ? t("restaurant_page.is_open")
              : t("restaurant_page.is_closed")}
          </Text>
        </HStack>
        {priceRange && (
          <HStack>
            <Image src="/price.svg" width={24} height={24} alt="" />
            <Text>
              {priceRange.minPrice} - {priceRange.maxPrice}
            </Text>
          </HStack>
        )}
      </VStack>
    </Box>
  );
};

export default RestaurantHeader;
