import { Response } from "express";

function sendSuccessResponse(res: Response, data: any, statusCode: number) {
  res.status(statusCode).json({
    success: true,
    statusCode,
    data,
  });
}

function sendErrorResponse(
  res: Response,
  message: string,
  statusCode: number,
  errors?: any
) {
  const response: any = {
    success: false,
    statusCode,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  res.status(statusCode).json(response);
}

export function ok(res: Response, data: any) {
  sendSuccessResponse(res, data, 200);
}

export function created(res: Response, data: any) {
  sendSuccessResponse(res, data, 201);
}

export function okNoResponse(res: Response) {
  res.status(204).send();
}

export function badRequest(res: Response, message: string, errors?: any) {
  sendErrorResponse(res, message, 400, errors);
}

export function unauthorized(
  res: Response,
  message = "Authentication required"
) {
  sendErrorResponse(res, message, 401);
}

export function forbidden(
  res: Response,
  message = "You don't have permission to access this resource"
) {
  sendErrorResponse(res, message, 403);
}

export function notFound(res: Response, message = "Resource not found") {
  sendErrorResponse(res, message, 404);
}

export function internalFailure(
  res: Response,
  message = "Internal server error"
) {
  sendErrorResponse(res, message, 500);
}
