import {
  CreateOrderParams,
  CartItem,
  OptionMandatoryValue,
  OptionChoiceValue,
} from "../schemas/order";
import { getOptionItemPrice } from "../db/optionItem";
import { getDishPrice } from "../db/dish";
import { get, objectify } from "radash";
import { Price } from "../../types/shared";
import { TRPCError } from "@trpc/server";
import { errors } from "../common/constants";

type PriceDict = Record<
  number,
  {
    id: number;
    price: number;
  }
>;

export const auditOrder = async (order: CreateOrderParams) => {
  const dishIds = order.items.map((item) => item.dishId);
  const optionFilter = order.items.flatMap((item) =>
    item.options.flatMap((option) =>
      option.mandatory
        ? [
            {
              id: option.value.optionItemId,
              dishId: item.dishId,
              restaurantId: order.restaurantId,
            },
          ]
        : option.value.map((optionItem) => ({
            id: optionItem.optionItemId,
            dishId: item.dishId,
            restaurantId: order.restaurantId,
          }))
    )
  );
  const [optionItemPrice, dishPrice] = await Promise.all([
    getOptionItemPrice(optionFilter),
    getDishPrice(dishIds, order.restaurantId),
  ]);
  const keyedOptionItemPrice = objectify(
    optionItemPrice,
    (item) => item.id,
    (item) => ({ id: item.id, price: (item.price as Price).value })
  );
  const keyedDishPrice = objectify(
    dishPrice,
    (item) => item.id,
    (item) => ({ id: item.id, price: (item.price as Price).value })
  );
  order.items.forEach(auditItem(keyedDishPrice, keyedOptionItemPrice));
};

const auditItem = (
  keyedDishPrice: PriceDict,
  keyedOptionItemPrice: PriceDict
) => {
  return (item: CartItem) => {
    const options = item.options;
    const totalOptionPrice = auditOption(options, keyedOptionItemPrice);
    auditDish(item, keyedDishPrice);
    if (item.dishPrice + totalOptionPrice !== item.totalPrice) {
      throw new TRPCError({
        message: errors.order.AUDIT_FAILED_AT_TOTAL,
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  };
};

const auditDish = (item: CartItem, keyedDishPrice: PriceDict) => {
  const doesDishPriceMatch =
    get(keyedDishPrice, `${item.dishId}.price`) === item.dishPrice;
  if (!doesDishPriceMatch) {
    throw new TRPCError({
      message: errors.order.AUDIT_FAILED_AT_DISH,
      code: "INTERNAL_SERVER_ERROR",
    });
  }
};

const auditOption = (
  options: CartItem["options"],
  keyedOptionItemPrice: PriceDict
) => {
  let totalOptionPrice = 0;
  options.forEach((option) => {
    totalOptionPrice += option.mandatory
      ? auditMandatoryChoice(option, keyedOptionItemPrice)
      : auditOptionalChoice(option.value, keyedOptionItemPrice);
  });
  return totalOptionPrice;
};

const auditMandatoryChoice = (
  option: OptionMandatoryValue,
  keyedOptionItemPrice: PriceDict
) => {
  const doesPriceMatch =
    option.price ===
    get(keyedOptionItemPrice, `${option.value.optionItemId}.price`);
  if (doesPriceMatch) {
    return option.price;
  }
  throw new TRPCError({
    message: errors.order.AUDIT_FAILED_AT_OPTION,
    code: "INTERNAL_SERVER_ERROR",
  });
};

const auditOptionalChoice = (
  optionItems: OptionChoiceValue["value"],
  keyedOptionItemPrice: PriceDict
) => {
  let totalOptionPrice = 0;
  optionItems.forEach((optionItem) => {
    const doesPriceMatch =
      optionItem.price ===
      get(keyedOptionItemPrice, `${optionItem.optionItemId}.price`);
    if (doesPriceMatch) {
      totalOptionPrice += optionItem.price;
      return;
    }
    throw new TRPCError({
      message: errors.order.AUDIT_FAILED_AT_OPTION,
      code: "INTERNAL_SERVER_ERROR",
    });
  });
  return totalOptionPrice;
};
