export interface ValidationErrorBody {
  type: string;
  value: any;
  msg: string;
  path: string;
  location: string;
}
export type BodyValidationError = ValidationErrorBody[] | undefined;

declare namespace Express {
  interface Locals {
    validationError: BodyValidationError;
  }
}
