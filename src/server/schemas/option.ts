import { z } from "zod";

export const getOptionFromDishIdSchema = z.object({
  restaurantId: z.number(),
  dishId: z.number(),
});

export type GetOptionFromDishIdParams = z.infer<
  typeof getOptionFromDishIdSchema
>;

export const getOptionForAllDishSchema = z.object({ restaurantId: z.number() });

export type GetOptionForAllDishParams = z.infer<
  typeof getOptionForAllDishSchema
>;
