export interface ShopeeRestaurantResponse {
  result: string;
  reply: {
    delivery_detail: ShopeeRestaurant;
  };
}

export interface RestaurantIdResponse {
  result: string;
  reply: {
    restaurant_id: number;
    delivery_id: number;
  };
}

export interface ShopeeMenuResponse {
  result: string;
  reply: {
    menu_infos: ShopeeMenu[];
  };
}

export interface ShopeePrice {
  text: string;
  value: number;
  unit: string;
}

export interface ShopeeDiscountPrice {
  text: string;
  value: number;
  unit: string;
}

export interface ShopeePhoto {
  width: number;
  value: string;
  height: number;
}

export interface ShopeeNtopPrice {
  text: string;
  unit: string;
  value: number;
}

export interface ShopeePrice2 {
  text: string;
  unit: string;
  value: number;
}

export interface ShopeeItem {
  name: string;
  weight: number;
  ntop_price: ShopeeNtopPrice;
  max_quantity: number;
  is_default: boolean;
  top_order: number;
  price: ShopeePrice2;
  id: number;
}

export interface ShopeeOptionItems {
  min_select: number;
  max_select: number;
  items: ShopeeItem[];
}

export interface ShopeeOption {
  ntop: string;
  mandatory: boolean;
  id: number;
  option_items: ShopeeOptionItems;
  name: string;
}

export interface ShopeeWeekDay {
  start: string;
  week_day: number;
  end: string;
}

export interface ShopeeTime {
  available: any[];
  week_days: ShopeeWeekDay[];
  not_available: any[];
}

export interface ShopeeDish {
  is_deleted: boolean;
  description: string;
  name: string;
  price: ShopeePrice;
  is_active: boolean;
  discount_price: ShopeeDiscountPrice;
  total_like: string;
  properties: any[];
  photos: ShopeePhoto[];
  options: ShopeeOption[];
  is_available: boolean;
  limit_type: number;
  is_searchable: boolean;
  time: ShopeeTime;
  id: number;
  discount_remaining_quantity: number;
  display_order: number;
  is_group_discount_item: boolean;
  quantity: number;
  available_time: string;
}

export interface ShopeeMenu {
  dish_type_id: number;
  display_order: number;
  dish_type_name: string;
  dishes: ShopeeDish[];
  is_group_discount: boolean;
}

export interface ShopeeRating {
  total_review: number;
  avg: number;
  display_total_review: string;
  app_link: string;
}

export interface ShopeeAvailableTime {
  date: string;
  times: string[];
}

export interface ShopeeServiceFee {
  text: string;
  value: number;
}

export interface ShopeeFormatText {
  resource_name: string;
  resource_args: string[];
}

export interface ShopeeAvgPrice {
  text: string;
  format_text: ShopeeFormatText;
  unit: string;
  value: number;
}

export interface ShopeeMinOrderValue {
  text: string;
  unit: string;
  value: number;
}

export interface ShopeeWeekDay {
  start_time: string;
  week_day: number;
  end_time: string;
}

export interface ShopeeTime {
  available: any[];
  week_days: ShopeeWeekDay[];
  not_available: any[];
}

export interface ShopeeText {
  resource_name: string;
}

export interface ShopeeOperating {
  status: number;
  color: string;
  close_time: string;
  open_time: string;
  text: ShopeeText;
}

export interface ShopeeText2 {
  resource_name: string;
  resource_args: string[];
}

export interface ShopeeShippingFee {
  text: ShopeeText2;
  value: number;
  is_increasing: number;
  rate: number;
  minimum_fee: string;
  unit: string;
}

export interface ShopeeDelivery {
  service_fee: ShopeeServiceFee;
  merchant_limit_distance: number;
  delivery_alert?: any;
  prepare_duration: number;
  payment_methods: number[];
  avg_price: ShopeeAvgPrice;
  min_order_value: ShopeeMinOrderValue;
  is_peak_mode: boolean;
  min_charge: string;
  is_open: boolean;
  promotions: any[];
  service_by: string;
  has_contract: boolean;
  ship_types: any[];
  setting_limit_distance: number;
  merchant_time: number;
  time: ShopeeTime;
  operating: ShopeeOperating;
  shipping_fee: ShopeeShippingFee;
  is_foody_delivery: boolean;
}

export interface ShopeePhoto {
  width: number;
  value: string;
  height: number;
}

export interface ShopeeConfirmMethods {}

export interface ShopeeMinOrderValue2 {
  text: string;
  unit: string;
  value: number;
}

export interface ShopeePriceRange {
  min_price: number;
  max_price: number;
}

export interface ShopeePosition {
  latitude: number;
  is_verified: boolean;
  longitude: number;
}

export interface ShopeePhoto2 {
  width: number;
  value: string;
  height: number;
}

export interface ShopeeResPhoto {
  photos: ShopeePhoto2[];
}

export interface ShopeeRestaurant {
  total_order: number;
  rating: ShopeeRating;
  is_subscribe: boolean;
  is_favorite: boolean;
  city_id: number;
  phones: string[];
  restaurant_id: number;
  district_id: number;
  brand_id: number;
  video?: any;
  asap_is_available: boolean;
  contract_type: number;
  id: number;
  location_url: string;
  foody_service_id: number;
  is_quality_merchant: boolean;
  available_times: ShopeeAvailableTime[];
  is_city_alert: boolean;
  categories: string[];
  cuisines: string[];
  short_description?: any;
  url_rewrite_name: string;
  price_slash_discounts: any[];
  delivery_fees: any[];
  vat?: any;
  confirm_language?: any;
  service_type: number;
  brand?: any;
  limit_distance: number;
  delivery_categories: number[];
  user_favorite_count: number;
  delivery: ShopeeDelivery;
  photos: ShopeePhoto[];
  is_display_cutlery: boolean;
  confirm_methods: ShopeeConfirmMethods;
  address: string;
  name_en: string;
  is_now_delivery: boolean;
  min_order_value: ShopeeMinOrderValue2;
  root_category_ids: number[];
  campaigns: any[];
  name: string;
  url: string;
  display_order: number;
  delivery_id: number;
  restaurant_url: string;
  is_pickup: boolean;
  price_range: ShopeePriceRange;
  parent_category_id: number;
  position: ShopeePosition;
  res_photos: ShopeeResPhoto[];
}

export interface ShopeeScrapeResult {
  menu: ShopeeMenu[];
  restaurant: ShopeeRestaurant;
}
