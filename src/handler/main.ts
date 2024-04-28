import { Request, Response } from "express";
import page from "../views/view";
import { getAllPublicArticles, getArticleBySlug, getPublicArticles } from "../service/article";
import { getAllPublicWorkshops, getPublicWorkshops, getWorkshopBySlug } from "../service/workshop";

export async function renderHome(req: Request, res: Response) {
  const articles = await getPublicArticles(10);
  const workshops = await getPublicWorkshops(4);
  res.render(page.public.index, {
    articles,
    workshops
  });
}

export async function renderAllArticles(req: Request, res: Response) {
  const articles = await getAllPublicArticles();
  if (req.query.search !== undefined && req.query.search !== "") {
    const search = req.query.search;
    const searchResult = articles.filter((article) => article.title.includes(String(search)));
    return res.render(page.public.allArticles, {
      articles: searchResult,
      categories: [],
      message: `Search result for ${search}`
    });
  } else if (req.query.category !== undefined && req.query.category !== "") {
    const category = req.query.category;
    const categoryResult = articles.filter((article) => article.category === String(category));
    return res.render(page.public.allArticles, {
      articles: categoryResult,
      categories: [],
      message: `Category result for ${category}`
    });
  }
  const articleCategory = articles.map((article) => article.category);
  const categories = articleCategory.filter((category, index) => articleCategory.indexOf(category) === index);
  res.render(page.public.allArticles, {
    articles,
    categories,
    message: "All Articles"
  });
}

export async function renderArticle(req: Request, res: Response) {
  const slug = req.params.slug;
  const article = await getArticleBySlug(slug);
  res.render(page.public.readArticle, {
    article
  });
}

export async function renderAllWorkshops(req: Request, res: Response) {
  const workshops = await getAllPublicWorkshops();
  res.render(page.public.allWorkshops, {
    workshops
  });
}

export async function renderWorkshop(req: Request, res: Response) {
  const slug = req.params.slug;
  const workshop = await getWorkshopBySlug(slug);
  res.render(page.public.readWorkshop, {
    workshop
  });
}