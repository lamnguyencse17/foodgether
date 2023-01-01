import express from "express";
import restaurantRouter from "./restaurant";

const router = express.Router();

router.use("/restaurants", restaurantRouter);
router.get("/", (req, res) => {
  return res.send("Hello World");
});

export default router;
