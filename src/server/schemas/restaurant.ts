import { z } from "zod";

export const doesRestaurantExistFromUrlSchema = z.object({
  url: z.string().url(),
});

export const fetchRestaurantFromUrlSchema = z.object({
  url: z.string().url(),
});

export const fetchRestaurantFromIdSchema = z.object({
  id: z.preprocess(Number, z.number()),
});

export type DoesRestaurantExistFromUrlParams = z.infer<
  typeof doesRestaurantExistFromUrlSchema
>;

export type FetchRestaurantFromUrlParams = z.infer<
  typeof fetchRestaurantFromUrlSchema
>;

export type FetchRestaurantFromIdParams = z.infer<
  typeof fetchRestaurantFromIdSchema
>;
