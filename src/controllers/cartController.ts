import { Request, Response } from "express";
import { applyDiscountsToCart } from "../services/cartService";
import * as httpResponse from "../utils/httpResponse";
import { z } from "zod";

const cartItemSchema = z.object({
  productId: z.string().or(z.number()),
  quantity: z.number().positive("Quantity must be positive"),
  price: z.number().positive("Price must be positive"),
});

const cartItemsSchema = z
  .array(cartItemSchema)
  .nonempty("Cart must not be empty");

function validateCartItems(items: any[]): string | null {
  const result = cartItemsSchema.safeParse(items);

  if (!result.success) {
    const errorMessage =
      result.error.issues[0].message || "Invalid cart items format";
    return errorMessage;
  }

  return null;
}

function applyDiscounts(req: Request, res: Response) {
  try {
    const { items } = req.body;

    const validationError = validateCartItems(items);
    if (validationError) {
      return httpResponse.badRequest(res, validationError);
    }

    const discountResult = applyDiscountsToCart(items);

    httpResponse.ok(res, discountResult);
  } catch (error) {
    if (error instanceof Error) {
      httpResponse.badRequest(res, error.message);
    } else {
      httpResponse.internalFailure(res);
    }
  }
}

export { applyDiscounts, validateCartItems };
