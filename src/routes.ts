import { Router, Request, Response } from "express";
import { notFound } from "./utils/httpResponse";
import {
  getCouponByIdController,
  listCouponsController,
  createCouponController,
  deleteCouponController,
  updateCouponController,
} from "./controllers/couponController";
import {
  applyCouponController,
  getApplicableCouponsController,
} from "./controllers/discountController";
import { maskExceptions } from "./utils/maskExceptions";

const router = Router();

// Health check endpoint
router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    message: "Discount service is running",
    timestamp: new Date().toISOString(),
  });
});

router.get("/coupons", maskExceptions(listCouponsController));
router.get("/coupons/:couponId", maskExceptions(getCouponByIdController));
router.post("/coupons", maskExceptions(createCouponController));
router.delete("/coupons/:couponId", maskExceptions(deleteCouponController));
router.put("/coupons/:couponId", maskExceptions(updateCouponController));
router.post(
  "/applicable-coupons",
  maskExceptions(getApplicableCouponsController)
);
router.post("/apply-coupon/:couponId", maskExceptions(applyCouponController));

// Catch all for invalid paths
router.all("*", (req: Request, res: Response) => {
  notFound(res, "Endpoint not found");
});

export default router;
