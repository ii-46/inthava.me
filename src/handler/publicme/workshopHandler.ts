import { RequestHandler } from "express";
import page from "../../views/view";
import {
  deleteWorkshopBySlug,
  getWorkshopBySlug,
  newWorkshop,
  updateWorkshopBySlug,
} from "../../service/workshop";
import {
  FormError,
  hasValidationError,
  mapFormError,
} from "../../middleware/publicme/formValidation";
import { notAuthorThanThrow } from "./index";
import { UpdateWorkshop } from "../../model/workshop";
import { internalServerErrorHandler } from "../errorHandler";

export const renderWorkshopForm: RequestHandler = (_req, res) => {
  const formError: FormError = {
    title: undefined,
    description: undefined,
    location: undefined,
    link: undefined,
    time: undefined,
    speaker: undefined,
    eventType: undefined,
    detail: undefined,
    status: undefined,
  };
  const error = res.locals.validationError;
  mapFormError(error, formError);
  res.render(page.publicme.newWorkshop, { formError });
};

export const createWorkshopHandler: RequestHandler = async (req, res, next) => {
  try {
    if (hasValidationError(res) || !req.file) {
      return next();
    }
    const {
      title,
      description,
      location,
      link,
      time,
      speaker,
      eventType,
      detail,
      status,
    } = req.body;
    const userId = req.session.user.userID;
    await newWorkshop({
      title,
      description,
      location,
      link,
      time,
      thumbnail: req.file.filename,
      speaker,
      eventType,
      detail,
      status,
      userId,
    });
    res.redirect("/publicme?message=workshop created successfully");
  } catch (e) {
    internalServerErrorHandler(e, req, res, next);
  }
};

export const renderWorkshopUpdateForm: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const formError: FormError = {
      title: undefined,
      description: undefined,
      location: undefined,
      link: undefined,
      time: undefined,
      speaker: undefined,
      eventType: undefined,
      detail: undefined,
      status: undefined,
    };
    const slug = req.params.slug;
    const workshop = await getWorkshopBySlug(slug);
    notAuthorThanThrow(workshop.userId, req.session.user.userID);
    res.render(page.publicme.editWorkshop, { workshop, formError });
  } catch (e) {
    internalServerErrorHandler(e, req, res, next);
  }
};

export const updateWorkshopHandler: RequestHandler = async (req, res, next) => {
  try {
    if (hasValidationError(res) || !req.file) {
      return next();
    }
    const userId = req.session.user.userID;
    const slug = req.params.slug;
    const workshop = await getWorkshopBySlug(slug);
    notAuthorThanThrow(workshop.userId, userId);
    const updateWorkshop: UpdateWorkshop = {
      slug: slug,
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      link: req.body.link,
      time: req.body.time,
      thumbnail: req.file?.filename ? req.file.filename : workshop.thumbnail,
      speaker: req.body.speaker,
      eventType: req.body.eventType,
      detail: req.body.detail,
      status: req.body.status,
      userId,
      version: workshop.version,
    };
    await updateWorkshopBySlug(updateWorkshop);
    res.redirect("/publicme?message=workshop updated successfully");
  } catch (e) {
    internalServerErrorHandler(e, req, res, next);
  }
};

export const renderWorkshopDeleteConfirm: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const slug = req.params.slug;
    const workshop = await getWorkshopBySlug(slug);
    notAuthorThanThrow(workshop.userId, req.session.user.userID);
    res.render(page.publicme.confirmDeleteArticle, { item: workshop });
  } catch (e) {
    internalServerErrorHandler(e, req, res, next);
  }
};

export const deleteWorkshop: RequestHandler = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const workshop = await getWorkshopBySlug(slug);
    if (req.body.type === "delete" && workshop) {
      await deleteWorkshopBySlug(slug);
      notAuthorThanThrow(req.session.user.userID, workshop.userId);
      return res.redirect("/publicme?message=workshop deleted successfully");
    }
    res.redirect(`/publicme?message=workshop delete failed`);
  } catch (e) {
    internalServerErrorHandler(e, req, res, next);
  }
};
