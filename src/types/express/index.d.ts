import session from "express-session";
interface ValidationErrorBody {
  type: string;
  value: any;
  msg: string;
  path: string;
  location: string;
}
type BodyValidationError = ValidationErrorBody[] | undefined;

declare module "express-session" {
  interface SessionData {
    user: {
      userID: string;
      email: string;
    };
  }
}
