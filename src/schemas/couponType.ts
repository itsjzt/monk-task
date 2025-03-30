export type DiscountType = "CART_WISE" | "PRODUCT_WISE" | "BXGY";

export type CouponType = {
  id: string;
  discountType: DiscountType;

  // Discount values - depends on type
  discountPercentage?: number; // For percentage-based discounts

  // these are "or", buy any one or more of them
  productWiseProducts?: Product[];

  // products are "and"
  // when you buy all of them, you get all products
  // using "or" would be too complex to be handle in a assignment
  buyProducts?: Product[];
  getProducts?: Product[];

  // Common constraints
  threshold?: number;
  endDate?: Date;
};

export type Product = {
  productId: string;
  quantity: number;
};
