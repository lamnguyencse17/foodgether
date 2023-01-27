import { z } from "zod";

const sharedOptionItem = z.object({
  id: z.string(),
  price: z.number(),
  optionItemId: z.number(),
});

const sharedOptionValue = z.object({
  optionId: z.number(),
  price: z.number(),
  id: z.string(),
});

export const optionMandatoryValueSchema = sharedOptionValue.and(
  z.object({
    mandatory: z.literal(true),
    value: sharedOptionItem,
  })
);

export type OptionMandatoryValue = z.infer<typeof optionMandatoryValueSchema>;

export const optionChoiceValueSchema = sharedOptionValue.and(
  z.object({
    mandatory: z.literal(false),
    value: z.array(sharedOptionItem),
  })
);

export type OptionChoiceValue = z.infer<typeof optionChoiceValueSchema>;

export const dishOptionValueSchema = z.union([
  optionMandatoryValueSchema,
  optionChoiceValueSchema,
]);

export type DishOptionValue = z.infer<typeof dishOptionValueSchema>;

export const cartItemSchema = z.object({
  dishId: z.number(),
  options: z.array(dishOptionValueSchema),
  totalPrice: z.number(),
  dishPrice: z.number(),
  id: z.string(),
});

export type CartItem = z.infer<typeof cartItemSchema>;

export const createOrderSchema = z.object({
  invitationId: z.string().cuid(),
  restaurantId: z.number(),
  items: z.array(cartItemSchema),
});

export type CreateOrderParams = z.infer<typeof createOrderSchema>;

export const getMemberCurrentOrderSchema = z.object({
  invitationId: z.string().cuid(),
  restaurantId: z.number(),
});

export type GetMemberCurrentOrderParams = z.infer<typeof createOrderSchema>;
