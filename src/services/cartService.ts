import { CartSchema } from "../data/schemas";
import { Discount } from "../data/discountType";
import { getAllDiscounts } from "./discountService";
import { calculateDiscountApplicability } from "./validationService";

interface CartItem {
  productId: number;
  quantity: number;
  price: number;
}

interface AppliedDiscount {
  discount: Discount;
  savedAmount: number;
}

interface DiscountApplicationResult {
  originalTotal: number;
  finalPrice: number;
  savedAmount: number;
  appliedDiscounts: AppliedDiscount[];
}

function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateCartWideDiscount(
  discount: Discount,
  cartTotal: number
): number {
  // Make sure the discount percentage exists
  if (!discount.discountPercentage) {
    return 0;
  }

  return cartTotal * (discount.discountPercentage / 100);
}

function calculateProductDiscount(
  discount: Discount,
  items: CartItem[]
): number {
  // Skip if no product list or percentage
  if (!discount.productWiseProducts || !discount.discountPercentage) {
    return 0;
  }

  let totalDiscount = 0;

  // Apply discount to each matching product
  discount.productWiseProducts.forEach((discountProduct) => {
    // Find the product in the cart
    const cartItem = items.find(
      (item) => item.productId === discountProduct.productId
    );

    if (cartItem) {
      // Calculate discount for this product
      const productTotal = cartItem.price * cartItem.quantity;
      const discountAmount =
        productTotal * (discount.discountPercentage! / 100);
      totalDiscount += discountAmount;
    }
  });

  return totalDiscount;
}

function calculateBXGYDiscount(discount: Discount, items: CartItem[]): number {
  // Skip if missing required data
  if (!discount.getProducts) {
    return 0;
  }

  let totalDiscount = 0;

  // For each "free" product in the discount
  discount.getProducts.forEach((getProduct) => {
    // Find this product in the cart
    const matchingItem = items.find(
      (item) => item.productId === getProduct.productId
    );

    if (matchingItem) {
      // Give discount for the minimum of what's in cart and what's offered free
      const discountQty = Math.min(matchingItem.quantity, getProduct.quantity);
      totalDiscount += matchingItem.price * discountQty;
    }
  });

  return totalDiscount;
}

function applyDiscountsToCart(cartItems: any): DiscountApplicationResult {
  // First, validate cart items with schema
  const validationResult = CartSchema.safeParse({ items: cartItems });

  if (!validationResult.success) {
    throw new Error(`Invalid cart data: ${validationResult.error.message}`);
  }

  // Cast to proper type after validation
  const items = cartItems as CartItem[];

  // Get the cart's total before discounts
  const cartTotal = calculateCartTotal(items);

  // Get all available discounts from our service
  const allDiscounts = getAllDiscounts();

  // Find discounts that can be applied to this cart
  const applicableDiscounts = allDiscounts.filter((discount) =>
    calculateDiscountApplicability(discount, items)
  );

  // If no applicable discounts, return original pricing
  if (applicableDiscounts.length === 0) {
    return {
      originalTotal: cartTotal,
      finalPrice: cartTotal,
      savedAmount: 0,
      appliedDiscounts: [],
    };
  }

  // Calculate best discount to apply (most savings for customer)
  let bestDiscount = null;
  let maxDiscountAmount = 0;
  let finalPrice = cartTotal;
  const appliedDiscounts: AppliedDiscount[] = [];

  // Try each applicable discount to find best one
  for (const discount of applicableDiscounts) {
    let discountAmount = 0;

    // Calculate discount amount based on type
    switch (discount.discountType) {
      case "CART_WISE":
        discountAmount = calculateCartWideDiscount(discount, cartTotal);
        break;

      case "PRODUCT_WISE":
        discountAmount = calculateProductDiscount(discount, items);
        break;

      case "BXGY":
        discountAmount = calculateBXGYDiscount(discount, items);
        break;

      default:
    }

    // Found a better discount?
    if (discountAmount > maxDiscountAmount) {
      maxDiscountAmount = discountAmount;
      bestDiscount = discount;
    }
  }

  // Apply best discount if found
  if (bestDiscount) {
    finalPrice = cartTotal - maxDiscountAmount;
    appliedDiscounts.push({
      discount: bestDiscount,
      savedAmount: maxDiscountAmount,
    });
  }

  // Ensure price never goes negative
  finalPrice = Math.max(0, finalPrice);

  return {
    originalTotal: cartTotal,
    finalPrice: finalPrice,
    savedAmount: cartTotal - finalPrice,
    appliedDiscounts: appliedDiscounts,
  };
}

export {
  applyDiscountsToCart,
  calculateCartTotal,
  calculateCartWideDiscount,
  calculateProductDiscount,
  calculateBXGYDiscount,
};
