import { z } from "zod";

export const createInvitationSchema = z.object({
  restaurantId: z.number(),
});
