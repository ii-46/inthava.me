import { RequestHandler } from "express";
import page from "../../views/view";
import {
  deleteArticleBySlug,
  getArticleBySlug,
  newArticle,
  updateArticleBySlug,
} from "../../service/article";

import { UpdateArticle } from "../../model/article";
import {
  BodyValidationError,
  FormError,
  hasValidationError,
  mapFormError,
} from "../../middleware/publicme/formValidation";

export const renderArticleForm: RequestHandler = (_req, res) => {
  const formError: FormError = {
    authorName: undefined,
    category: undefined,
    content: undefined,
    description: undefined,
    status: undefined,
    tags: undefined,
    title: undefined,
    thumb: undefined,
  };
  const error = res.locals.validationError;
  mapFormError(error, formError);
  res.render(page.publicme.newArticle, { formError });
};

export const createArticleHandler: RequestHandler = async (req, res, next) => {
  try {
    if (hasValidationError(res) || !req.file) {
      let formError: BodyValidationError = [];
      if (!req.file) {
        formError.push({
          type: "",
          value: null,
          msg: "unsupported image format",
          path: "thumbnail",
          location: "file",
        });
      }
      if (hasValidationError(res)) {
        formError = formError.concat(res.locals.validationError);
      }
      res.locals.validationError = formError;
      return next();
    }

    const { title, content, category, tags, description, status, authorName } =
      req.body;
    const userId = req.session.user.userID;
    const article = {
      title,
      content,
      category,
      tags: tags.split(",").map((tag: string) => tag.trim()),
      thumbnail: req.file.filename,
      description,
      status,
      authorId: userId,
      authorName,
    };
    await newArticle({
      ...article,
    });
    res.redirect("/publicme");
  } catch (e) {
    throw e;
  }
};

export const renderArticleEditForm: RequestHandler = async (req, res) => {
  const formError: FormError = {
    authorName: undefined,
    category: undefined,
    content: undefined,
    description: undefined,
    status: undefined,
    tags: undefined,
    thumb: undefined,
    title: undefined,
  };
  const error = res.locals.validationError;
  mapFormError(error, formError);
  const slug = req.params.slug;
  const article = await getArticleBySlug(slug);
  res.render(page.publicme.editArticle, { article, formError });
};

export const updateArticleHandler: RequestHandler = async (req, res, next) => {
  if (hasValidationError(res)) {
    return next();
  }
  console.log("updateArticleHandler");
  const userId = req.session.user.userID;
  try {
    const slug = req.params.slug;
    const article = await getArticleBySlug(slug);
    const updateArticle: UpdateArticle = {
      ...article,
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      tags: req.body.tags.split(",").map((tag: string) => tag.trim()),
      thumbnail: req.file?.filename ? req.file.filename : article.thumbnail,
      description: req.body.description,
      status: req.body.status,
      authorId: userId,
      authorName: req.body.authorName,
      version: article.version,
    };
    notAuthorThanThrow(userId, article.authorId);
    await updateArticleBySlug(updateArticle);
    res.redirect("/publicme?message=update success");
  } catch (e) {
    throw e;
  }
};

export const renderArticleDeleteConfirm: RequestHandler = async (req, res) => {
  const slug = req.params.slug;
  const article = await getArticleBySlug(slug);
  res.render(page.publicme.confirmDeleteArticle, { item: article });
  res.end();
};

export const deleteArticleHandler: RequestHandler = async (req, res) => {
  try {
    const slug = req.params.slug;
    const article = await getArticleBySlug(slug);
    if (req.body.type === "delete" && article) {
      notAuthorThanThrow(req.session.user.userID, article.authorId);
      await deleteArticleBySlug(slug);
      return res.redirect("/publicme?message=delete success");
    }
    res.redirect("/publicme");
  } catch (e) {
    throw e;
  }
};

/**
 * @throws {Error}
 */
function notAuthorThanThrow(id: string, authorId: string) {
  if (!(id === authorId)) {
    throw new Error("not author");
  }
}
