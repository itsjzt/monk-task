import { internalFailure } from "./httpResponse";

export function maskExceptions(fn: Function) {
  return async function (req: any, res: any, next: any) {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error(error);
      internalFailure(res, "Internal server error");
    }
  };
}
