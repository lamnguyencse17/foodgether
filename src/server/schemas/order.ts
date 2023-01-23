import { z } from "zod";

export const optionMandatoryValueSchema = z.object({
  optionId: z.number(),
  mandatory: z.literal(true),
  value: z.number(),
  price: z.number(),
});

export type OptionMandatoryValue = z.infer<typeof optionMandatoryValueSchema>;

export const optionChoiceValueSchema = z.object({
  optionId: z.number(),
  mandatory: z.literal(false),
  value: z.array(z.object({ id: z.number(), price: z.number() })),
  price: z.number(),
});

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
  uid: z.string(),
});

export type CartItem = z.infer<typeof cartItemSchema>;

export const createOrderSchema = z.object({
  invitationId: z.string().cuid(),
  restaurantId: z.number(),
  items: z.array(cartItemSchema),
});
