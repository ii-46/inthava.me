import { getUserById } from "../../service/user";
import { RequestHandler } from "express";

export const auth: RequestHandler = async (req, res, next) => {
  if (req.session.user) {
    const { userID, email } = req.session.user;
    try {
      await getUserById(userID);
    } catch (e) {
      return res.redirect("/publicme/signin");
    }
    return next();
  }
  return res.redirect("/publicme/signin");
};

export const alreadyAuth: RequestHandler = async (req, res, next) => {
  if (req.session.user) {
    const { userID, email } = req.session.user;
    try {
      await getUserById(userID);
    } catch (e) {
      return next();
    }
    return res.redirect("/publicme");
  }
  return next();
};
