import { Router } from "express";
import { renderAllArticles, renderAllWorkshops, renderArticle, renderHome, renderWorkshop } from "../handler/main";
import publicme from "./publicme";
import parseBody from "../middleware/parseBody";
import page from "../views/view";

const router = Router();

router.get("/", (req, res, next) => {
  res.redirect("home");
});

router.get("/home", renderHome);

router.get("/article/all", ...(parseBody()), renderAllArticles);

router.get("/article/:slug", renderArticle);

router.get("/workshop/all", renderAllWorkshops);

router.get("/workshop/:slug", renderWorkshop);

router.use("/publicme", publicme);

router.use((req, res, next) => {
  console.log("PAGE NOT FOUND");
  res.redirect("/home");
});

router.use((err, req, res, next) => {
  console.error("main route", err);
  res.render(page.error.basic);
});

export default router;