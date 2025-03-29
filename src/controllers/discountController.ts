import { Request, Response } from "express";
import {
  getAllDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from "../services/discountService";
import * as httpResponse from "../utils/httpResponse";

function handleDiscountDates(discountData: any) {
  // Handle date conversion from string to Date object
  if (discountData.endDate && typeof discountData.endDate === "string") {
    // Make sure it's a valid date string
    const dateObj = new Date(discountData.endDate);
    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date format for endDate");
    }
    return dateObj;
  }
  return discountData.endDate;
}

function getDiscounts(req: Request, res: Response) {
  try {
    const allDiscounts = getAllDiscounts();

    // Filter if needed
    let result = allDiscounts;

    httpResponse.ok(res, result);
  } catch (error) {
    httpResponse.internalFailure(res);
  }
}

function getDiscount(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    // Validate the ID
    if (!isFinite(id)) {
      return httpResponse.badRequest(res, "Invalid discount ID");
    }

    // Lookup the discount
    const discount = getDiscountById(id);

    if (!discount) {
      return httpResponse.notFound(res);
    }

    httpResponse.ok(res, discount);
  } catch (error) {
    httpResponse.internalFailure(res);
  }
}

function addDiscount(req: Request, res: Response) {
  try {
    const discountData = req.body;

    // Don't allow setting an ID in create requests
    if (discountData.id) {
      delete discountData.id; // Remove any ID to let the system generate one
    }

    // Handle date conversion
    try {
      const endDate = handleDiscountDates(discountData);
      if (endDate) discountData.endDate = endDate;
    } catch (err) {
      return httpResponse.badRequest(res, (err as Error).message);
    }

    // Create the discount
    const newDiscount = createDiscount(discountData);

    httpResponse.created(res, newDiscount);
  } catch (error) {
    if (error instanceof Error) {
      httpResponse.badRequest(res, error.message);
    } else {
      httpResponse.internalFailure(res);
    }
  }
}

function modifyDiscount(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const discountData = req.body;

    if (!isFinite(id)) {
      return httpResponse.badRequest(res, "Invalid discount ID");
    }

    // Make sure we have data to update
    if (Object.keys(discountData).length === 0) {
      return httpResponse.badRequest(res, "No data provided for update");
    }

    discountData.id = id;

    // check if the discount exists
    const existingDiscount = getDiscountById(id);

    if (!existingDiscount) {
      return httpResponse.notFound(res, "Discount not found");
    }

    // Handle date conversion
    try {
      const endDate = handleDiscountDates(discountData);
      if (endDate) discountData.endDate = endDate;
    } catch (err) {
      return httpResponse.badRequest(res, (err as Error).message);
    }

    const updatedDiscount = updateDiscount(id, discountData);

    httpResponse.ok(res, updatedDiscount);
  } catch (error) {
    if (error instanceof Error) {
      httpResponse.badRequest(res, error.message);
    } else {
      httpResponse.internalFailure(res);
    }
  }
}

function removeDiscount(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!isFinite(id)) {
      return httpResponse.badRequest(res, "Invalid discount ID");
    }

    if (!getDiscountById(id)) {
      return httpResponse.notFound(res, "Discount not found");
    }

    deleteDiscount(id);

    httpResponse.okNoResponse(res);
  } catch (error) {
    if (error instanceof Error) {
      httpResponse.badRequest(res, error.message);
    } else {
      httpResponse.internalFailure(res);
    }
  }
}

export {
  getDiscounts,
  getDiscount,
  addDiscount,
  modifyDiscount,
  removeDiscount,
};
