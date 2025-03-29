import { Router, Request, Response } from "express";
import {
  getDiscounts,
  getDiscount,
  addDiscount,
  modifyDiscount,
  removeDiscount,
} from "./controllers/discountController";
import { applyDiscounts } from "./controllers/cartController";
import { notFound } from "./utils/httpResponse";

const router = Router();

// Health check endpoint
router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    message: "Discount service is running",
    timestamp: new Date().toISOString(),
  });
});

router.get("/discounts", getDiscounts);
router.get("/discounts/:id", getDiscount);
router.post("/discounts", addDiscount);
router.put("/discounts/:id", modifyDiscount);
router.delete("/discounts/:id", removeDiscount);
router.post("/cart/apply-discounts", applyDiscounts);

// Catch all for invalid paths
router.all("*", (req: Request, res: Response) => {
  notFound(res, "Api endpoint not found");
});

export default router;
