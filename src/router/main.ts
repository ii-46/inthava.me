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
import {
  internalServerErrorHandler,
  pageNotFoundHandler,
} from "../handler/errorHandler";

const router = Router();

router.get("/", (_req, res) => {
  res.redirect("home");
});

router.get("/home", renderHome);

router.get("/article", (_req, res) => {
  res.redirect("/article/all");
});

router.get("/article/all", ...parseBody(), renderAllArticles);

router.get("/article/:slug", renderArticle, pageNotFoundHandler);

router.get("/workshop", (_req, res) => {
  res.redirect("/workshop/all");
});

router.get("/workshop/all", renderAllWorkshops);

router.get("/workshop/:slug", renderWorkshop, pageNotFoundHandler);

router.use("/publicme", publicme);

router.use(pageNotFoundHandler);

router.use(internalServerErrorHandler);

export default router;
