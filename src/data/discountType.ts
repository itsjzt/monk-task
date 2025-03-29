export type DiscountType = "CART_WISE" | "PRODUCT_WISE" | "BXGY";

export type Discount = {
  id: number;
  discountType: DiscountType;

  // Discount values - depends on type
  discountPercentage?: number; // For percentage-based discounts
  productWiseProducts?: Product[]; // For product-specific: applicable products
  buyProducts?: Product[];
  getProducts?: Product[];

  // Common constraints
  threshold?: number;
  maximumUsages?: number;
  currentUsages?: number;
  endDate?: Date;
};

export type Product = {
  productId: number;
  quantity: number;
};
