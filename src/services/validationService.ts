import { Discount } from "../data/discountType";

function validateProduct(product: any): boolean {
  if (!product || typeof product !== "object") {
    return false;
  }

  if (typeof product.productId !== "number" || product.productId <= 0) {
    return false;
  }

  if (typeof product.quantity !== "number" || product.quantity <= 0) {
    return false;
  }

  return true;
}

function meetsThreshold(discount: Discount, cartItems: any[]): boolean {
  if (!discount.threshold) return true;

  let cartTotal = 0;
  for (const item of cartItems) {
    if (!item.price || !item.quantity) continue;
    cartTotal += item.price * item.quantity;
  }

  return cartTotal >= discount.threshold;
}

function hasBuyProducts(discount: Discount, cartItems: any[]): boolean {
  if (
    !discount.buyProducts ||
    !Array.isArray(discount.buyProducts) ||
    discount.buyProducts.length === 0
  ) {
    return false;
  }

  for (const buyProduct of discount.buyProducts) {
    const inCart = cartItems.find(
      (item) => item.productId === buyProduct.productId
    );

    if (!inCart || inCart.quantity < buyProduct.quantity) {
      return false;
    }
  }

  return true;
}

function hasDiscountableProducts(
  discount: Discount,
  cartItems: any[]
): boolean {
  if (
    !discount.productWiseProducts ||
    !Array.isArray(discount.productWiseProducts) ||
    discount.productWiseProducts.length === 0
  ) {
    return false;
  }

  return discount.productWiseProducts.some((discountProduct) =>
    cartItems.some((item) => item.productId === discountProduct.productId)
  );
}

function calculateDiscountApplicability(
  discount: Discount,
  cartItems: any[]
): boolean {
  if (discount.endDate && new Date() > new Date(discount.endDate)) {
    return false;
  }

  if (discount.maximumUsages !== undefined && discount.maximumUsages <= 0) {
    return false;
  }

  if (!meetsThreshold(discount, cartItems)) {
    return false;
  }

  switch (discount.discountType) {
    case "CART_WISE":
      return true;

    case "PRODUCT_WISE":
      return hasDiscountableProducts(discount, cartItems);

    case "BXGY":
      return hasBuyProducts(discount, cartItems);

    default:
      return false;
  }
}

export {
  validateProduct,
  calculateDiscountApplicability,
  meetsThreshold,
  hasBuyProducts,
  hasDiscountableProducts,
};
