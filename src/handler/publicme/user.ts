import { Request, Response } from "express";
import view from "../../views/view";
import { getUserByEmailAndPassword, newUser } from "../../service/user";

export function renderSignupForm(req: Request, res: Response) {
  throw new Error("Not implemented");
  res.render(view.publicme.signup);
}

export async function signup(req: Request, res: Response) {
  const { email, password, name } = req.body;
  try {
    const user = await newUser({ email, password, name });
    res.redirect("/signin");
  } catch (e) {
    res.render(view.error.basic);
  }
}

export function renderSigninForm(req: Request, res: Response) {
  res.render(view.publicme.signin);
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
