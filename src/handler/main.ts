import { RequestHandler } from "express";
import page from "../views/view";
import {
  errorArticlesNotFound,
  getAllPublicArticles,
  getArticleBySlug,
  getArticlesByCategory,
  getPublicArticles,
  getSearchedArticles,
} from "../service/article";
import {
  getAllPublicWorkshops,
  getPublicWorkshops,
  getWorkshopBySlug,
} from "../service/workshop";
import { ServiceError } from "../error/serviceError";
import { internalServerErrorHandler } from "./errorHandler";

export const renderHome: RequestHandler = async (req, res, next) => {
  try {
    const articles = await getPublicArticles(10);
    const workshops = await getPublicWorkshops(4);
    res.render(page.public.index, {
      articles,
      workshops,
    });
  } catch (e) {
    internalServerErrorHandler(e, req, res, next);
  }
};

export const renderAllArticles: RequestHandler = async (req, res, next) => {
  if (req.query.search !== undefined && req.query.search !== "") {
    const search = req.query.search as string;
    try {
      const searchResult = await getSearchedArticles(search);
      return res.render(page.public.allArticles, {
        articles: searchResult,
        categories: [],
        message: `Searched result for ${search}`,
      });
    } catch (e) {
      if ((e as ServiceError).message === errorArticlesNotFound) {
        return res.render(page.public.allArticles, {
          articles: [],
          categories: [],
          message: `No result for ${search}`,
        });
      }
    }
  } else if (req.query.category !== undefined && req.query.category !== "") {
    const category = req.query.category;
    try {
      const categoryResult = await getArticlesByCategory(category as string);
      return res.render(page.public.allArticles, {
        articles: categoryResult,
        categories: [],
        message: `Category result for ${category}`,
      });
    } catch (e) {
      if ((e as ServiceError).message === errorArticlesNotFound) {
        return res.render(page.public.allArticles, {
          articles: [],
          categories: [],
          message: `No result for ${category}`,
        });
      }
    }
  }
  try {
    const articles = await getAllPublicArticles();
    const articleCategory = articles.map((article) => article.category);
    const categories = articleCategory.filter(
      (category, index) => articleCategory.indexOf(category) === index,
    );
    res.render(page.public.allArticles, {
      articles,
      categories,
      message: "All Articles",
    });
  } catch (e) {
    internalServerErrorHandler(e, req, res, next);
  }
};

export const renderArticle: RequestHandler = async (req, res, next) => {
  const slug = req.params.slug;
  let article: Awaited<ReturnType<typeof getArticleBySlug>>;
  try {
    article = await getArticleBySlug(slug);
  } catch (e) {
    return next();
  }
  res.render(page.public.readArticle, {
    article,
  });
};

export const renderAllWorkshops: RequestHandler = async (req, res, next) => {
  try {
    const workshops = await getAllPublicWorkshops();
    res.render(page.public.allWorkshops, {
      workshops,
    });
  } catch (e) {
    internalServerErrorHandler(e, req, res, next);
  }
};

export const renderWorkshop: RequestHandler = async (req, res, next) => {
  const slug = req.params.slug;
  try {
    const workshop = await getWorkshopBySlug(slug);
    res.render(page.public.readWorkshop, {
      workshop,
    });
  } catch (e) {
    next();
  }
};
