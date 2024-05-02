import { RequestHandler } from "express";
import view from "../../views/view";
import {
  errorUserNotFound,
  getUserByEmail,
  getUserByEmailAndPassword,
  newUser,
} from "../../service/user";
import { ServiceError } from "../../error/serviceError";
import {
  BodyValidationError,
  FormError,
  hasValidationError,
  mapFormError,
} from "../../middleware/publicme/formValidation";

export const renderSignUpForm: RequestHandler = (_req, res) => {
  const formError: FormError = {
    email: undefined,
    password: undefined,
    name: undefined,
  };
  const error: BodyValidationError = res.locals.validationError;
  mapFormError(error, formError);
  res.render(view.publicme.signup, { formError });
};

export const signUpHandler: RequestHandler = async (req, res, next) => {
  if (hasValidationError(res)) {
    return next();
  }
  const { email, password, name } = req.body;
  try {
    await getUserByEmail(email);
    res.redirect(
      "/publicme/signin?message=Your account already exists, please sign in.",
    );
  } catch (e) {
    if (e instanceof ServiceError && e.message === errorUserNotFound) {
      await newUser({ email, password, name });
      res.redirect("/publicme/signin?message=Your account has been created.");
    }
    throw e;
  }
};

export const renderSignInForm: RequestHandler = (req, res) => {
  const formError: FormError = {
    email: undefined,
    password: undefined,
  };
  const error: BodyValidationError = res.locals.validationError;
  mapFormError(error, formError);
  let message: string | undefined = undefined;
  if (req.query["message"] !== undefined) {
    message = req.query["message"].toString();
  }
  res.render(view.publicme.signin, {
    message,
    formError,
  });
};

export const signInHandler: RequestHandler = async (req, res, next) => {
  if (hasValidationError(res)) {
    return next();
  }
  const { email, password } = req.body;
  try {
    const user = await getUserByEmailAndPassword(email, password);
    req.session.user = {
      userID: user.id,
      email: user.email,
    };
    res.redirect("/publicme");
  } catch (e) {
    if (e instanceof ServiceError && e.message === errorUserNotFound) {
      res.redirect(
        "/publicme/signin?message=Email or password is incorrect, please try again.",
      );
    }
    throw e;
  }
};

export const signOut: RequestHandler = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("SignUpError", err);
      return res.redirect("/publicme");
    }
    res.clearCookie("sid");
    res.redirect("/publicme");
  });
};
