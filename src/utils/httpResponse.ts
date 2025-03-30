import { Response } from "express";

function sendSuccessResponse(res: Response, data: any, statusCode: number) {
  res.status(statusCode).json({
    success: true,
    statusCode,
    data,
  });
}

function sendErrorResponse(res: Response, message: string, statusCode: number) {
  res.status(statusCode).json({ success: false, statusCode, message });
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

export function badRequest(res: Response, message: string) {
  sendErrorResponse(res, message, 400);
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
