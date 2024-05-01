import { Router } from "express";
import { alreadyAuth } from "../../middleware/publicme/authentication";
import {
  renderSignInForm,
  renderSignUpForm,
  signIn,
  signOut,
  signUp,
} from "../../handler/publicme/userHandler";
import parseBody from "../../middleware/parseBody";
import { body } from "express-validator";
import { formValidation } from "../../middleware/publicme/formValidation";

export default function userRoute(router: Router) {
  router.get("/signup", alreadyAuth, renderSignUpForm);
  router.post(
    "/signup",
    alreadyAuth,
    ...parseBody(),
    body("name").isString(),
    body("email").isEmail(),
    body("password").isString(),
    formValidation,
    signUp,
    renderSignUpForm,
  );

  router.get("/signin", alreadyAuth, renderSignInForm);
  router.post(
    "/signin",
    alreadyAuth,
    ...parseBody(),
    body("email").isEmail(),
    body("password").isString(),
    formValidation,
    signIn,
  );

  router.get("/signout", signOut);
  router.post("/signout", (req, res) => {
    res.redirect("/publicme/signout");
  });
}
