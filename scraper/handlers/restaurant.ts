import { Request, Response } from "express";
import { z } from "zod";
import { upsertMenu } from "../db/menu";
import { upsertRestaurant } from "../db/restaurant";
import { scrapeRestaurant } from "../scraper";

const getRestaurantSchema = z.object({
  url: z.string().url(),
});

export const getRestaurantHandler = async (req: Request, res: Response) => {
  try {
    const { url } = getRestaurantSchema.parse(req.body);
    const result = await scrapeRestaurant(url);
    const restaurant = await upsertRestaurant(result.restaurant);
    const upsertedRestaurant = await upsertMenu(result.menu, restaurant.id);
    return res.status(200).json({ ...upsertedRestaurant });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: err.issues });
    }
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
