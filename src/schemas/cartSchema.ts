import { z } from "zod";

const cartItemSchema = z.object({
  productId: z.string().or(z.number()),
  quantity: z.number().positive("Quantity must be positive"),
  price: z.number().positive("Price must be positive"),
});

export const cartSchema = z.object({
  items: z.array(cartItemSchema).nonempty("Cart must not be empty"),
});
