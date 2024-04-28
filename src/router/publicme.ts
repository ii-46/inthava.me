import { Router } from "express";
import { uploadImage } from "../middleware/uploadFile";
import { body } from "express-validator";
import {
  createArticle, createWorkshop, deleteArticle, deleteWorkshop,
  index,
  renderArticleDeleteConfirm,
  renderArticleEditForm,
  renderArticleForm, renderWorkshopForm, renderWorkshopUpdateForm, renderWorkshopDeleteConfirm,
  updateArticle, updateWorkshop, renderSignupForm, signup, renderSigninForm, signin, signout
} from "../handler/publicme";
import { formValidation } from "../middleware/publicme/formValidation";
import { alreadyAuth, auth } from "../middleware/publicme/authentication";
import parseBody from "../middleware/parseBody";
import page from "../views/view";

const router = Router();


router.get("/", auth, index);
router.get("/article/new", auth, renderArticleForm);

router.post("/article/new", auth, uploadImage.single("thumb"),
  body("title").isString(),
  body("content").isString(),
  body("category").isString(),
  body("tags").isString(),
  body("description").isString(),
  body("status").isString(),
  body("authorName").isString(),
  formValidation,
  createArticle);

router.get("/article/:slug/edit", auth,
  renderArticleEditForm);
router.post("/article/:slug/edit",
  auth,
  uploadImage.single("thumb"),
  body("title").isString(),
  body("content").isString(),
  body("category").isString(),
  body("tags").isString(),
  body("description").isString(),
  body("status").isString(),
  body("authorName").isString(),
  formValidation,
  updateArticle);

router.get("/article/:slug/delete", auth,
  renderArticleDeleteConfirm);


router.post("/article/:slug/delete", auth, ...(parseBody()),
  deleteArticle);

router.get("/workshop/new", auth, renderWorkshopForm);
router.post("/workshop/new", auth, uploadImage.single("thumb"),
  body("title").isString(),
  body("description").isString(),
  body("location").isString(),
  body("link").isString(),
  body("time").isString(),
  body("speaker").isString(),
  body("eventType").isString(),
  body("detail").isString(),
  body("status").isString(),
  formValidation,
  createWorkshop);

router.get("/workshop/:slug/edit", auth, renderWorkshopUpdateForm);
router.post("/workshop/:slug/edit", uploadImage.single("thumb"),
  body("title").isString(),
  body("description").isString(),
  body("location").isString(),
  body("link").isString(),
  body("time").isString(),
  body("speaker").isString(),
  body("eventType").isString(),
  body("detail").isString(),
  body("status").isString(),
  formValidation,
  updateWorkshop);

router.get("/workshop/:slug/delete", auth, renderWorkshopDeleteConfirm);
router.post("/workshop/:slug/delete", auth, ...(parseBody()), deleteWorkshop);

// router.get("/signup", alreadyAuth, renderSignupForm);
router.post("/signup", alreadyAuth, ...(parseBody()),
  body("name").isString(),
  body("email").isEmail(),
  body("password").isString(),
  formValidation, signup);
router.get("/signin", alreadyAuth, renderSigninForm);

router.post("/signin", alreadyAuth, ...(parseBody()),
  body("email").isEmail(),
  body("password").isString(),
  formValidation,
  signin);

router.get("/signout", signout);
router.post("/signout", (req, res) => {
  res.redirect("/publicme/signout");
});

router.use((req, res) => {
  res.redirect("/publicme");
});

router.use((err, req, res, next) => {
  console.error("publicme route", err);
  res.render(page.error.basic);
});


export default router;