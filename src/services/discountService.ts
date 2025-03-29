import { Discount } from "../data/discountType";
import { discounts } from "../data/discounts";
import { DiscountSchema } from "../data/schemas";

function getAllDiscounts(): Discount[] {
  return discounts.filter((d) => !isDiscountExpired(d));
}

function getDiscountById(id: number): Discount | undefined {
  return discounts.find((discount) => discount.id === id);
}

function createDiscount(discountData: any): Discount {
  const validationResult = DiscountSchema.safeParse(discountData);

  if (!validationResult.success) {
    throw new Error(`Invalid discount data: ${validationResult.error.message}`);
  }

  // Create a new ID for the discount (simplistic approach)
  // In a real app, this would be handled by a database
  const lastId =
    discounts.length > 0 ? Math.max(...discounts.map((d) => d.id)) : 0;
  const newId = lastId + 1;

  const newDiscount = {
    ...discountData,
    id: newId,
  };

  discounts.push(newDiscount);

  return newDiscount;
}

function updateDiscount(id: number, discountData: any): Discount {
  // Validate new discount data
  const validationResult = DiscountSchema.safeParse(discountData);

  if (!validationResult.success) {
    throw new Error(`Invalid discount data: ${validationResult.error.message}`);
  }

  // Find the discount to update
  const index = discounts.findIndex((d) => d.id === id);

  if (index === -1) {
    throw new Error("Discount not found");
  }

  const updatedDiscount = { ...discountData, id };

  discounts[index] = updatedDiscount;

  return updatedDiscount;
}

function deleteDiscount(id: number): void {
  const index = discounts.findIndex((d) => d.id === id);

  if (index === -1) {
    throw new Error("Discount not found");
  }

  // Remove from the array
  delete discounts[index];
}

function isDiscountExpired(discount: Discount): boolean {
  // If no end date is specified, discount doesn't expire
  if (!discount.endDate) return false;

  const now = new Date();
  return now > new Date(discount.endDate);
}

function isDiscountValid(discount: Discount): boolean {
  // Check if the discount has expired
  if (isDiscountExpired(discount)) {
    return false;
  }

  // Check if we've reached maximum usage limit
  // if (discount.maximumUsages !== undefined && discount.maximumUsages <= 0) {
  //   return false;
  // }

  return true;
}

export {
  getAllDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  isDiscountExpired,
  isDiscountValid,
};
