import { Response } from "express";

const view = {
  public: {
    index: "public/index.ejs",
    allArticles: "public/all-articles.ejs",
    readArticle: "public/read-article.ejs",
    allWorkshops: "public/all-workshops.ejs",
    readWorkshop: "public/read-workshop.ejs",
  },
  publicme: {
    newArticle: "publicme/new-article.ejs",
    index: "publicme/index.ejs",
    editArticle: "publicme/edit-article.ejs",
    confirmDeleteArticle: "publicme/confirm-delete.ejs",
    newWorkshop: "publicme/new-workshop.ejs",
    editWorkshop: "publicme/edit-workshop.ejs",
    signup: "publicme/signup.ejs",
    signin: "publicme/signin.ejs",
  },
  error: {
    basic: "error/error.ejs",
    errorPage: "error/error-page.ejs",
  },
};

export interface ErrorPage {
  res: Response;
  statusCode: number;
  subject: string;
  message: string;
  redirectMessage?: string;
  redirectTo?: string;
}

export function renderErrorPage({
  res,
  statusCode,
  subject,
  message,
  redirectMessage = "🏠 ກັບໄປໜ້າຫຼັກ",
  redirectTo = "/",
}: ErrorPage) {
  res.render(view.error.errorPage, {
    statusCode,
    subject,
    message,
    redirectMessage,
    redirectTo,
  });
}

export default view;
