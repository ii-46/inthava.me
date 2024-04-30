import { Router } from "express";
import {
  renderAllArticles,
  renderAllWorkshops,
  renderArticle,
  renderHome,
  renderWorkshop,
} from "../handler/main";
import publicme from "./publicme";
import parseBody from "../middleware/parseBody";
import page from "../views/view";
import {
  internalServerErrorHandler,
  pageNotFoundHandler,
} from "../handler/errorHandler";

const router = Router();

router.get("/", (req, res, next) => {
  res.redirect("home");
});

router.get("/home", renderHome);

router.get("/article/all", ...parseBody(), renderAllArticles);

router.get("/article/:slug", renderArticle);

router.get("/workshop/all", renderAllWorkshops);

router.get("/workshop/:slug", renderWorkshop);

router.use("/publicme", publicme);

router.use(pageNotFoundHandler);

router.use(internalServerErrorHandler);

export default router;
