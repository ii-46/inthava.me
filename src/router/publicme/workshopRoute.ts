import { Router } from "express";
import { auth } from "../../middleware/publicme/authentication";
import {
  createWorkshop,
  deleteWorkshop,
  renderWorkshopDeleteConfirm,
  renderWorkshopForm,
  renderWorkshopUpdateForm,
  updateWorkshop,
} from "../../handler/publicme/workshopHandler";
import { uploadImage } from "../../middleware/uploadFile";
import { body } from "express-validator";
import { formValidation } from "../../middleware/publicme/formValidation";
import parseBody from "../../middleware/parseBody";

export default function workshopRoute(router: Router) {
  router.get("/workshop/new", auth, renderWorkshopForm);
  router.post(
    "/workshop/new",
    auth,
    uploadImage.single("thumb"),
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
    createWorkshop,
  );

  router.get("/workshop/:slug/edit", auth, renderWorkshopUpdateForm);
  router.post(
    "/workshop/:slug/edit",
    uploadImage.single("thumb"),
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
    updateWorkshop,
  );

  router.get("/workshop/:slug/delete", auth, renderWorkshopDeleteConfirm);
  router.post("/workshop/:slug/delete", auth, ...parseBody(), deleteWorkshop);
}
