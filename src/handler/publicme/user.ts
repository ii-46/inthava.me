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

type SignupFormError = {
  email: string | undefined;
  password: string | undefined;
  name: string | undefined;
};
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

export const signup: RequestHandler = async (req, res, next) => {
  if (res.locals.validationError) {
    next();
  }
  const { email, password, name } = req.body;
  try {
    await getUserByEmail(email);
    return res.redirect(
      "/publicme/signin?error=Your account already exists, please sign in.",
    );
  } catch (e) {
    if (e instanceof ServiceError && e.message === errorUserNotFound) {
      await newUser({ email, password, name });
      res.redirect("/publicme/signin");
    }
  }
};

export function renderSigninForm(req: Request, res: Response) {
  let error: string | undefined = undefined;
  if (req.query["error"] !== undefined) {
    error = req.query["error"].toString();
  }
  res.render(view.publicme.signin, {
    error,
  });
}

export async function signin(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmailAndPassword(email, password);
    if (!user) {
      return res.redirect("/publicme/signin");
    }
    req.session.user = {
      userID: user.id,
      email: user.email,
    };

    res.redirect("/publicme");
  } catch (e) {
    console.log("signin error", e);
    res.render(view.error.basic);
  }
}

export function signOut(req: Request, res: Response) {
  req.session.destroy((err) => {
    if (err) {
      console.log("session destroy error", err);
      return res.redirect("/publicme");
    }
    res.clearCookie("sid");
    res.redirect("/publicme");
  });
}
