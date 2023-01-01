import express from "express";
import { getRestaurantHandler } from "../handlers/restaurant";

const restaurantRouter = express.Router();

restaurantRouter.post("/", getRestaurantHandler);

export default restaurantRouter;
