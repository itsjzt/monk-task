import { Request, Response } from "express";
import * as httpResponse from "../utils/httpResponse";
import {
  listCoupons,
  getCouponById,
  createCoupon,
  deleteCoupon,
  updateCoupon,
} from "../services/couponService";
import {
  BXGYCouponSchema,
  cartWiseCouponSchema,
  productWiseCouponSchema,
} from "../schemas/couponSchema";

export function listCouponsController(req: Request, res: Response) {
  const query = req.query.showExpired;
  const showExpired = query === "true";
  const allCoupons = listCoupons({ showExpired });

  httpResponse.ok(res, allCoupons);
}

export function getCouponByIdController(req: Request, res: Response) {
  const couponId = req.params.couponId;

  // Lookup the Coupon
  const coupon = getCouponById(couponId);

  if (!coupon) {
    return httpResponse.notFound(res);
  }

  return httpResponse.ok(res, coupon);
}

export function createCouponController(req: Request, res: Response) {
  const couponData = req.body;

  // make sure we have discount type field
  if (!couponData || !("discountType" in couponData)) {
    return httpResponse.badRequest(res, "Invalid request body");
  }

  let validationStatus = null;
  switch (couponData.discountType) {
    case "CART_WISE":
      validationStatus = cartWiseCouponSchema.safeParse(couponData);
      break;

    case "PRODUCT_WISE":
      validationStatus = productWiseCouponSchema.safeParse(couponData);
      break;

    case "BXGY":
      validationStatus = BXGYCouponSchema.safeParse(couponData);
      break;

    default:
      return httpResponse.badRequest(res, "Invalid discount type");
  }

  // Handle date conversion
  if (!validationStatus.success) {
    return httpResponse.badRequest(res, validationStatus.error.message);
  }

  // check the expiration date
  if (couponData.endDate) {
    const endDate = new Date(couponData.endDate);

    if (isNaN(endDate.getTime())) {
      return httpResponse.badRequest(res, "Invalid date format for endDate");
    }

    if (endDate < new Date()) {
      return httpResponse.badRequest(res, "End date cannot be in the past");
    }

    couponData.endDate = endDate;
  }

  const newCoupon = createCoupon(couponData);

  httpResponse.created(res, newCoupon);
}

export function updateCouponController(req: Request, res: Response) {
  const couponId = req.params.couponId;
  const couponData = req.body;

  if (!couponId) {
    return httpResponse.badRequest(res, "Coupon ID is required");
  }

  // this is duplicated from createCouponController
  // but extracting this in a good way would require error based response
  if (!couponData || !("discountType" in couponData)) {
    return httpResponse.badRequest(res, "Invalid request body");
  }

  let validationStatus = null;
  switch (couponData.discountType) {
    case "CART_WISE":
      validationStatus = cartWiseCouponSchema.safeParse(couponData);
      break;

    case "PRODUCT_WISE":
      validationStatus = productWiseCouponSchema.safeParse(couponData);
      break;

    case "BXGY":
      validationStatus = BXGYCouponSchema.safeParse(couponData);
      break;

    default:
      return httpResponse.badRequest(res, "Invalid discount type");
  }

  // Handle date conversion
  if (!validationStatus.success) {
    return httpResponse.badRequest(res, validationStatus.error.message);
  }

  // check the expiration date
  if (couponData.endDate) {
    const endDate = new Date(couponData.endDate);

    if (isNaN(endDate.getTime())) {
      return httpResponse.badRequest(res, "Invalid date format for endDate");
    }

    if (endDate < new Date()) {
      return httpResponse.badRequest(res, "End date cannot be in the past");
    }

    couponData.endDate = endDate;
  }

  // check if the Coupon exists
  const existingCoupon = getCouponById(couponId);

  if (!existingCoupon) {
    return httpResponse.notFound(res, "Coupon not found");
  }

  const updatedCoupon = updateCoupon(couponId, couponData);

  httpResponse.ok(res, updatedCoupon);
}

export function deleteCouponController(req: Request, res: Response) {
  const couponId = req.params.couponId;

  if (!getCouponById(couponId)) {
    return httpResponse.notFound(res, "Coupon not found");
  }

  deleteCoupon(couponId);

  httpResponse.okNoResponse(res);
}
