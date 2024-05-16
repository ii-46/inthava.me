import { Router } from "express";
import { auth } from "../../middleware/publicme/authentication";
import {
  createArticleHandler,
  deleteArticleHandler,
  renderArticleDeleteConfirm,
  renderArticleEditForm,
  renderArticleForm,
  updateArticleHandler,
} from "../../handler/publicme/articleHandler";
import { uploadImage } from "../../middleware/uploadFile";
import { body } from "express-validator";
import { formValidation } from "../../middleware/publicme/formValidation";
import parseBody from "../../middleware/parseBody";

export default function articleRoute(router: Router) {
  router.get("/article/new", auth, renderArticleForm);
  router.post(
    "/article/new",
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
    createArticleHandler,
    renderArticleForm,
  );

  router.get("/article/:slug/edit", auth, renderArticleEditForm);
  router.post(
    "/article/:slug/edit",
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
    updateArticleHandler,
    renderArticleEditForm,
  );

  router.get("/article/:slug/delete", auth, renderArticleDeleteConfirm);
  router.post(
    "/article/:slug/delete",
    auth,
    ...parseBody(),
    deleteArticleHandler,
  );
}
