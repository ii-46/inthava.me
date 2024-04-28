import { getUserById } from "../../service/user";

export async function auth(req, res, next) {
  if (req.session.user) {
    const { userID, email } = req.session.user;
    const user = await getUserById(userID);
    if (!user) {
      return res.redirect("/publicme/signin");
    }
    return next();
  }
  return res.redirect("/publicme/signin");
}

export async function alreadyAuth(req, res, next) {
  if (req.session.user) {
    const { userID, email } = req.session.user;
    const user = await getUserById(userID);
    if (!user) {
      return next();
    }
    return res.redirect("/publicme");
  }
  return next();
}