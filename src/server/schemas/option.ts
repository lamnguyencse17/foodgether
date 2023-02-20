import { z } from "zod";

export const getOptionFromDishIdSchema = z.object({
  restaurantId: z.number(),
  dishId: z.number(),
});

export type GetOptionFromDishIdParams = z.infer<typeof getOptionFromDishIdSchema>;

export const getInvitationOptionFromDishIdSchema = z.object({
  restaurantId: z.number(),
  invitationDishId: z.number(),
});

export type GetInvitationOptionFromDishIdParams = z.infer<
  typeof getInvitationOptionFromDishIdSchema
>;

export const getOptionForAllDishSchema = z.object({ restaurantId: z.number() });

export type GetOptionForAllDishParams = z.infer<typeof getOptionForAllDishSchema>;
