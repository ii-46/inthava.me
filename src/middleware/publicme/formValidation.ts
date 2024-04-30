import { RequestHandler, Response } from "express";
import { validationResult } from "express-validator";
import { BodyValidationError } from "../../../type";

export const formValidation: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.locals.validationError = errors["errors"] as BodyValidationError;
  }
  next();
};

export function hasValidationError(res: Response): boolean {
  return !!res.locals.validationError;
}
