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
import { maskInternalErrors } from "./utils/maskInternalError";

const router = Router();

// Health check endpoint
router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    message: "Discount service is running",
    timestamp: new Date().toISOString(),
  });
});

router.get("/coupons", maskInternalErrors(listCouponsController));
router.get("/coupons/:couponId", maskInternalErrors(getCouponByIdController));
router.post("/coupons", maskInternalErrors(createCouponController));
router.delete("/coupons/:couponId", maskInternalErrors(deleteCouponController));
router.put("/coupons/:couponId", maskInternalErrors(updateCouponController));
router.post(
  "/applicable-coupons",
  maskInternalErrors(getApplicableCouponsController)
);
router.post(
  "/apply-coupon/:couponId",
  maskInternalErrors(applyCouponController)
);

// Catch all for invalid paths
router.all("*", (req: Request, res: Response) => {
  notFound(res, "Api endpoint not found");
});

export default router;
