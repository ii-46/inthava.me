import { validationResult } from "express-validator";

export function formValidation(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  // TODO: error handling
  res.send(errors.array());
  res.end();
}