import { z } from "zod";

const ProductSchema = z.object({
  productId: z.string(),
  quantity: z.number().positive("Quantity must be positive"),
});

// Schema for cart-wide percentage discounts
export const cartWiseCouponSchema = z.object({
  discountType: z.literal("CART_WISE"),
  discountPercentage: z
    .number()
    .positive("Discount percentage must be positive")
    .max(100, "Discount percentage cannot exceed 100%"),
  threshold: z.number().positive("Threshold must be positive").optional(),
  endDate: z.string().optional(),
});

// Schema for product-specific discounts
export const productWiseCouponSchema = z.object({
  discountType: z.literal("PRODUCT_WISE"),
  discountPercentage: z
    .number()
    .positive("Discount percentage must be positive")
    .max(100, "Discount percentage cannot exceed 100%"),
  productWiseProducts: z
    .array(ProductSchema)
    .min(1, "Must include at least one product"),
  threshold: z.number().positive("Threshold must be positive").optional(),
  endDate: z.string().optional(),
});

// Schema for Buy X Get Y promotions
export const BXGYCouponSchema = z.object({
  discountType: z.literal("BXGY"),
  buyProducts: z
    .array(ProductSchema)
    .min(1, "Must specify at least one product to buy"),
  getProducts: z
    .array(ProductSchema)
    .min(1, "Must specify at least one product to get"),
  threshold: z.number().positive("Threshold must be positive").optional(),
  endDate: z.string().optional(),
});
