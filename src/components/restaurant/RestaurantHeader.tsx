import { Box, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import Image from "next/image";
import { FunctionComponent } from "react";
import { Photo } from "../../types/shared";
import { useTranslation } from "next-i18next";

type RestaurantHeaderProps = {
  photo?: Photo;
  name: string;
  address: string;
  isAvailable: boolean;
  priceRange: {
    minPrice: number;
    maxPrice: number;
  };
};

const RestaurantHeader: FunctionComponent<RestaurantHeaderProps> = ({
  photo,
  name = "",
  address = "",
  isAvailable = false,
  priceRange,
}) => {
  const { t } = useTranslation();
  return (
    <>
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
        <Heading>{name}</Heading>
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
    </>
  );
};

export default RestaurantHeader;
