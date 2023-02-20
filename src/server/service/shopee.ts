import {
  RestaurantIdResponse,
  ShopeeRestaurantResponse,
  ShopeeMenuResponse,
} from "../../types/shopee";

const shopeeFetchHeaders = {
  accept: "application/json, text/plain, */*",
  "accept-language": "en-US,en;q=0.9,vi-VN;q=0.8,vi;q=0.7",
  "sec-ch-ua": '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"macOS"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "cross-site",
  "x-foody-access-token": "",
  "x-foody-api-version": "1",
  "x-foody-app-type": "1004",
  "x-foody-client-id": "",
  "x-foody-client-language": "vi",
  "x-foody-client-type": "1",
  "x-foody-client-version": "3.0.0",
};

const shopeeFetchOptions = {
  headers: shopeeFetchHeaders,
  referrer: "https://shopeefood.vn/",
  referrerPolicy: "strict-origin-when-cross-origin",
  body: null,
  method: "GET",
  mode: "cors",
  credentials: "omit",
} as RequestInit;

const getUrlParamsFromUrl = (url: string) => {
  const splittedUrl = url.split("/");
  return `${splittedUrl[3]}/${splittedUrl[4]}`;
};

export const fetchShopeeRestaurantId = async (url: string): Promise<RestaurantIdResponse> => {
  const restaurantIdResponse = await fetch(
    `https://gappapi.deliverynow.vn/api/delivery/get_from_url?url=${getUrlParamsFromUrl(url)}`,
    shopeeFetchOptions,
  );
  return restaurantIdResponse.json();
};

export const fetchShopeeRestaurantFromDeliveryId = async (
  id: number,
): Promise<ShopeeRestaurantResponse> => {
  const restaurantResponse = await fetch(
    `https://gappapi.deliverynow.vn/api/delivery/get_detail?id_type=2&request_id=${id}`,
    shopeeFetchOptions,
  );
  return restaurantResponse.json();
};

export const fetchShopeeRestaurantFromId = async (
  id: number,
): Promise<ShopeeRestaurantResponse> => {
  const restaurantResponse = await fetch(
    `https://gappapi.deliverynow.vn/api/delivery/get_detail?id_type=1&request_id=${id}`,
    shopeeFetchOptions,
  );
  return restaurantResponse.json();
};

export const fetchShopeeMenu = async (id: number): Promise<ShopeeMenuResponse> => {
  const restaurantResponse = await fetch(
    `https://gappapi.deliverynow.vn/api/dish/get_delivery_dishes?id_type=2&request_id=${id}`,
    shopeeFetchOptions,
  );
  return restaurantResponse.json();
};
