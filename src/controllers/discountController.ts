import { Request, Response } from "express";
import {
  applyCoupon,
  checkIsCouponApplicable,
  getApplicableCoupons,
} from "../services/discountService";
import { cartSchema } from "../schemas/cartSchema";
import { badRequest, notFound, ok } from "../utils/httpResponse";
import { getCouponById } from "../services/couponService";

export function applyCouponController(req: Request, res: Response) {
  const cart = req.body;
  const couponId = req.params.couponId;

  const validation = cartSchema.safeParse(cart);

  if (!validation.success) {
    return badRequest(res, validation.error.message);
  }

  // check if couponId is provided
  let coupon = getCouponById(couponId);

  if (!coupon) {
    return notFound(res, "coupon not found");
  }

  const isApplicable = checkIsCouponApplicable(coupon, cart);

  if (!isApplicable) {
    return badRequest(res, "Coupon is not applicable");
  }

  const discountResult = applyCoupon(cart, coupon);

  ok(res, discountResult);
}

export function getApplicableCouponsController(req: Request, res: Response) {
  const cart = req.body;

  const validation = cartSchema.safeParse(cart);

  if (!validation.success) {
    return badRequest(res, validation.error.message);
  }

  const applicableCoupons = getApplicableCoupons(cart);

  ok(res, applicableCoupons);
}
