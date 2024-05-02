import { RequestHandler, Response } from "express";
import { validationResult } from "express-validator";

export interface ValidationErrorBody {
  type: string;
  value: any;
  msg: string;
  path: string;
  location: string;
}
export type BodyValidationError = ValidationErrorBody[] | undefined;

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

export type FormError = {
  [key: string]: string | undefined;
};

/**
 * @throws {FormValidationError}
 */
export const mapFormError = (
  error: BodyValidationError,
  formError: FormError,
): void => {
  try {
    if (error !== undefined) {
      for (const errorKey in error) {
        const e = error[errorKey];
        formError[e.path] = e.msg;
      }
    }
  } catch (e) {
    throw new FormValidationError(e.message);
  }
};

class FormValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FormValidationError";
  }
}
