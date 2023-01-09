import { z } from "zod";

export const getOptionFromDishIdSchema = z.object({
  restaurantId: z.number(),
  dishId: z.number(),
});

export type GetOptionFromDishIdParams = z.infer<
  typeof getOptionFromDishIdSchema
>;
