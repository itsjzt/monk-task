import { generateNewCouponId } from "../utils/generateNewCouponId";
import { CouponType } from "../schemas/couponType";
import { coupons } from "../data/coupons";
import { checkIsCouponExpired } from "../utils/checkIsCouponExpired";
import { CartType } from "../schemas/cartType";
import { calculateCartTotal } from "../utils/calculateCartTotal";

export function listCoupons({ showExpired }: { showExpired: boolean }) {
  if (showExpired) {
    return coupons;
  }

  return coupons.filter((d) => !checkIsCouponExpired(d));
}

export function getCouponById(couponId: string) {
  return coupons.find((coupon) => coupon.id === couponId);
}

export function createCoupon(discountData: any) {
  const newId = generateNewCouponId();

  const newCoupon: CouponType = {
    ...discountData,
    id: newId,
  };

  coupons.push(newCoupon);

  return newCoupon;
}

export function updateCoupon(id: string, discountData: any) {
  // Find the discount to update
  const index = coupons.findIndex((d) => d.id === id);

  if (index === -1) {
    throw new Error("Discount not found");
  }

  const updatedDiscount = { ...discountData, id };

  coupons[index] = updatedDiscount;

  return updatedDiscount;
}

export function deleteCoupon(id: string) {
  const index = coupons.findIndex((d) => d.id === id);

  if (index === -1) {
    throw new Error("Discount not found");
  }

  // Remove from the array
  coupons.splice(index, 1);
}
