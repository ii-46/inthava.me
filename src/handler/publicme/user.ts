import { Request, RequestHandler, Response } from "express";
import view from "../../views/view";
import {
  errorUserNotFound,
  getUserByEmail,
  getUserByEmailAndPassword,
  newUser,
} from "../../service/user";
import { ServiceError } from "../../error/serviceError";
import { BodyValidationError } from "../../../type";
import { hasValidationError } from "../../middleware/publicme/formValidation";

interface SignupFormError {
  email: string | undefined;
  password: string | undefined;
  name: string | undefined;
}
export const renderSignUpForm: RequestHandler = (req, res) => {
  const formError: SignupFormError = {
    email: undefined,
    password: undefined,
    name: undefined,
  };
  const error: BodyValidationError = res.locals.validationError;
  if (error) {
    for (const errorKey in error) {
      const e = error[errorKey];
      switch (e.path) {
        case "email":
          formError.email = e.msg;
          break;
        case "password":
          formError.password = e.msg;
          break;
        case "name":
          formError.name = e.msg;
          break;
      }
    }
  }
  res.render(view.publicme.signup, { formError });
};

export const signUp: RequestHandler = async (req, res, next) => {
  if (hasValidationError(res)) {
    next();
  }
  const { email, password, name } = req.body;
  try {
    await getUserByEmail(email);
    return res.redirect(
      "/publicme/signin?message=Your account already exists, please sign in.",
    );
  } catch (e) {
    if (e instanceof ServiceError && e.message === errorUserNotFound) {
      await newUser({ email, password, name });
      res.redirect("/publicme/signin?message=Your account has been created.");
    }
  }
};

interface SignInFormError {
  email: string | undefined;
  password: string | undefined;
}
export const renderSignInForm: RequestHandler = (req, res) => {
  const formError: SignInFormError = {
    email: undefined,
    password: undefined,
  };
  const error: BodyValidationError = res.locals.validationError;
  if (error) {
    for (const errorKey in error) {
      const e = error[errorKey];
      switch (e.path) {
        case "email":
          formError.email = e.msg;
          break;
        case "password":
          formError.password = e.msg;
          break;
      }
    }
  }
  let message: string | undefined = undefined;
  if (req.query["message"] !== undefined) {
    message = req.query["message"].toString();
  }
  res.render(view.publicme.signin, {
    message,
    formError,
  });
};

export const signIn: RequestHandler = async (req, res, next) => {
  if (hasValidationError(res)) {
    next();
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
    res.redirect(
      "/publicme/signin?message=Email or password is incorrect, please try again.",
    );
  }
};

export const signOut: RequestHandler = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("session destroy error", err);
      return res.redirect("/publicme");
    }
    res.clearCookie("sid");
    res.redirect("/publicme");
  });
};
