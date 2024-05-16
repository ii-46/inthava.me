import { Router } from "express";

import {
  internalServerErrorHandler,
  pageNotFoundHandler,
} from "../../handler/errorHandler";
import userRoute from "./userRoute";
import articleRoute from "./articleRoute";
import workshopRoute from "./workshopRoute";
import { auth } from "../../middleware/publicme/authentication";
import { index } from "../../handler/publicme";

const router = Router();

router.get("/", auth, index);

userRoute(router);

articleRoute(router);

workshopRoute(router);

router.use(pageNotFoundHandler);

router.use(internalServerErrorHandler);

export default router;
