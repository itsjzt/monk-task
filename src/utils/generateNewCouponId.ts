import { coupons } from "../data/coupons";

export function generateNewCouponId() {
  const randomId = Date.now().toString(36);

  if (checkIfCouponExists(randomId.toString())) {
    return generateNewCouponId();
  }

  return randomId;
}

function checkIfCouponExists(id: string) {
  return coupons.some((coupon) => coupon.id === id);
}
