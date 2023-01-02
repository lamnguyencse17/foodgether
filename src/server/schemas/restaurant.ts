import { z } from "zod";

export const doesRestaurantExistFromUrlSchema = z.object({
  url: z.string().url(),
});

export const fetchRestaurantFromUrlSchema = z.object({
  url: z.string().url(),
});

export type DoesRestaurantExistFromUrlParams = z.infer<
  typeof doesRestaurantExistFromUrlSchema
>;

export type FetchRestaurantFromUrlParams = z.infer<
  typeof fetchRestaurantFromUrlSchema
>;
