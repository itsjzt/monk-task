import { coupons } from "../data/coupons";
import { CartType } from "../schemas/cartType";
import { CouponType } from "../schemas/couponType";
import { calculateCartTotal } from "../utils/calculateCartTotal";
import { checkIsCouponExpired } from "../utils/checkIsCouponExpired";

export function applyCoupon(cart: CartType, coupon: CouponType) {
  const cartTotal = calculateCartTotal(cart);
  let discountedCart;

  switch (coupon.discountType) {
    case "CART_WISE":
      discountedCart = calculateCartWideDiscount(coupon, cart);
      break;
    case "PRODUCT_WISE":
      discountedCart = calculateProductDiscount(coupon, cart);
      break;
    case "BXGY":
      discountedCart = calculateBXGYDiscount(coupon, cart);
      break;
  }

  const totalDiscount = discountedCart.items.reduce(
    (total, item) => total + (item.discount || 0),
    0
  );

  return {
    items: discountedCart.items,
    totalPrice: cartTotal,
    totalDiscount: totalDiscount,
    finalPrice: cartTotal - totalDiscount,
  };
}

export function getApplicableCoupons(cart: CartType) {
  return coupons
    .filter((coupon) => checkIsCouponApplicable(coupon, cart))
    .map((coupon) => ({
      id: coupon.id,
      discountType: coupon.discountType,
      discount: calculateDiscountAmount(coupon, cart),
    }));
}

export function checkIsCouponApplicable(coupon: CouponType, cart: CartType) {
  // check expiry

  if (checkIsCouponExpired(coupon)) {
    return false;
  }

  const cartSubTotal = cart.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // check threshold
  if (coupon.threshold && cartSubTotal < coupon.threshold) {
    return false;
  }

  switch (coupon.discountType) {
    case "CART_WISE":
      // No additional checks needed for cart-wise discounts
      return true;
    case "BXGY":
      // check all buy products are in cart
      if (!coupon.buyProducts || !Array.isArray(coupon.buyProducts)) {
        // should not happen, because of validation
        return false;
      }

      // check if all buy products are in the cart
      return coupon.buyProducts.every((buyProduct) => {
        const cartItem = cart.items.find(
          (item) => item.productId === buyProduct.productId
        );

        if (!cartItem) {
          return false;
        }

        return cartItem.quantity >= buyProduct.quantity;
      });
    case "PRODUCT_WISE":
      if (
        !coupon.productWiseProducts ||
        !Array.isArray(coupon.productWiseProducts)
      ) {
        // should not happen, because of validation
        return false;
      }

      // check if any of the discountable products are in the cart
      return coupon.productWiseProducts.some((discountProduct) => {
        return cart.items.find(
          (item) =>
            item.productId === discountProduct.productId &&
            item.quantity >= discountProduct.quantity
        );
      });
  }
}

function calculateCartWideDiscount(coupon: CouponType, cart: CartType) {
  let discountAmount = coupon.discountPercentage || 0;

  return {
    ...cart,
    items: cart.items.map((item) => ({
      ...item,
      discount: (item.price * discountAmount) / 100,
    })),
  };
}

function calculateProductDiscount(coupon: CouponType, cart: CartType) {
  let discountPercentage = coupon.discountPercentage || 0;

  let cartItems = cart.items.map((item) => {
    let discount = 0;
    let isDiscounted = coupon.productWiseProducts?.find(
      (a) => a.productId === item.productId && a.quantity <= item.quantity
    );

    let subtotal = item.price * item.quantity;

    if (isDiscounted) {
      discount = (subtotal * discountPercentage) / 100;
    }

    return {
      ...item,
      discount,
    };
  });

  return {
    ...cart,
    items: cartItems,
  };
}

function calculateBXGYDiscount(coupon: CouponType, cart: CartType) {
  const cartItems = cart.items.map((item) => {
    let discount = 0;

    console.log({ coupon, cart });

    // we already checked if all buy products are in the cart
    // Check if the item is in the "get" products
    const freeProduct = coupon.getProducts!.find(
      (p) => p.productId === item.productId
    );

    if (freeProduct) {
      // Calculate the discount based on the quantity of the item
      discount = item.price * Math.min(item.quantity, freeProduct.quantity);
    }

    return {
      ...item,
      discount,
    };
  });

  return {
    ...cart,
    items: cartItems,
  };
}

function calculateDiscountAmount(coupon: CouponType, cart: CartType) {
  let discountedCart;

  switch (coupon.discountType) {
    case "CART_WISE":
      discountedCart = calculateCartWideDiscount(coupon, cart);
      break;
    case "PRODUCT_WISE":
      discountedCart = calculateProductDiscount(coupon, cart);
      break;
    case "BXGY":
      discountedCart = calculateBXGYDiscount(coupon, cart);
      break;
  }

  // Calculate total discount amount
  const totalDiscount = discountedCart.items.reduce(
    (total, item) => total + (item.discount || 0),
    0
  );

  return totalDiscount;
}
