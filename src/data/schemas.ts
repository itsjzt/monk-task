import { z } from "zod";

// Base schema for products in discounts
export const ProductSchema = z.object({
  productId: z.number().int().positive("Product ID must be a positive integer"),
  quantity: z.number().positive("Quantity must be positive"),
});

// Schema for cart-wide percentage discounts
export const CartWiseDiscountSchema = z.object({
  discountType: z.literal("CART_WISE"),
  discountPercentage: z
    .number()
    .positive("Discount percentage must be positive")
    .max(100, "Discount percentage cannot exceed 100%"),
  threshold: z.number().positive("Threshold must be positive").optional(),
  maximumUsages: z.number().int("Maximum usages must be an integer").optional(),
  endDate: z.date().optional(),
});

// Schema for product-specific discounts
export const ProductWiseDiscountSchema = z.object({
  discountType: z.literal("PRODUCT_WISE"),
  discountPercentage: z
    .number()
    .positive("Discount percentage must be positive")
    .max(100, "Discount percentage cannot exceed 100%"),
  productWiseProducts: z
    .array(ProductSchema)
    .min(1, "Must include at least one product"),
  threshold: z.number().positive("Threshold must be positive").optional(),
  maximumUsages: z.number().int("Maximum usages must be an integer").optional(),
  endDate: z.date().optional(),
});

// Schema for Buy X Get Y promotions
export const BXGYDiscountSchema = z.object({
  discountType: z.literal("BXGY"),
  buyProducts: z
    .array(ProductSchema)
    .min(1, "Must specify at least one product to buy"),
  getProducts: z
    .array(ProductSchema)
    .min(1, "Must specify at least one product to get"),
  threshold: z.number().positive("Threshold must be positive").optional(),
  maximumUsages: z.number().int("Maximum usages must be an integer").optional(),
  endDate: z.date().optional(),
});

// Combined discount schema with discriminated union
export const DiscountSchema = z.discriminatedUnion("discountType", [
  CartWiseDiscountSchema,
  ProductWiseDiscountSchema,
  BXGYDiscountSchema,
]);

// Schema for cart items
export const CartItemSchema = z.object({
  productId: z.number().int().positive("Product ID must be a positive integer"),
  quantity: z.number().positive("Quantity must be positive"),
  price: z.number().positive("Price must be positive"),
});

// Schema for cart
export const CartSchema = z.object({
  items: z.array(CartItemSchema).min(1, "Cart must contain at least one item"),
});
