import {
  deleteArticleBySlug,
  getArticleBySlug,
  getArticles,
  newArticle,
  updateArticleBySlug,
} from "../../service/article";
import multer from "multer";
import { Request, Response } from "express";
import page from "../../views/view";
import {
  deleteWorkshopBySlug,
  getWorkshopBySlug,
  getWorkshops,
  newWorkshop,
  updateWorkshopBySlug,
} from "../../service/workshop";
import { getUserByEmailAndPassword, newUser } from "../../service/user";
import { ArticleInterface } from "../../model/article";

export async function index(req: Request, res: Response) {
  const articles = await getArticles();
  const workshops = await getWorkshops();
  res.render(page.publicme.index, { articles, workshops });
}

export function renderArticleForm(req: Request, res: Response) {
  res.render(page.publicme.newArticle);
}

export async function createArticle(req: Request, res: Response) {
  try {
    if (!req.file) {
      console.error("file is not support for create article");
      res.render(page.error.basic);
    }
    const { title, content, category, tags, description, status, authorName } =
      req.body;
    const userId = req.session.user.userID;
    const article = await newArticle({
      title,
      content,
      category,
      tags: tags.split(",").map((tag: string) => tag.trim()),
      thumbnail: req.file.filename,
      description,
      status,
      authorId: userId,
      authorName,
    });
    if (!article) {
      console.error("article not created in createArticle()");
      res.render(page.error.basic);
    }
    res.redirect("/publicme");
  } catch (e) {
    if (req.file && e instanceof multer.MulterError) {
      console.error("image upload error");
      res.render(page.error.basic);
    }

    console.error("create article error", e);
    res.render(page.error.basic);
  }
}

export async function renderArticleEditForm(req: Request, res: Response) {
  const slug = req.params.slug;
  const article = await getArticleBySlug(slug);
  res.render(page.publicme.editArticle, { article });
}

export async function updateArticle(req: Request, res: Response) {
  const userId = req.session.user.userID;
  try {
    const slug = req.params.slug;
    const article = await getArticleBySlug(slug);
    const updateArticle: ArticleInterface = {
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      tags: req.body.tags.split(",").map((tag) => tag.trim()),
      thumbnail: req.file?.filename ? req.file.filename : article.thumbnail,
      description: req.body.description,
      status: req.body.status,
      authorId: userId,
      authorName: req.body.authorName,
    };
    const updatedArticle = await updateArticleBySlug(slug, updateArticle);
    if (!updatedArticle) {
      console.error("article not updated in updateArticle()");
      res.render(page.error.basic);
    }
    res.redirect("/publicme");
  } catch (e) {
    if (req.file && e instanceof multer.MulterError) {
      console.log("image upload error ");
      res.render(page.error.basic);
    }

    console.error("update article error", e);
    res.render(page.error.basic);
  }
}

export async function renderArticleDeleteConfirm(req: Request, res: Response) {
  const slug = req.params.slug;
  const article = await getArticleBySlug(slug);
  res.render(page.publicme.confirmDeleteArticle, { item: article });
  res.end();
}

export async function deleteArticle(req: Request, res: Response) {
  const slug = req.params.slug;
  const article = await getArticleBySlug(slug);
  if (req.body.type === "delete" && article) {
    const deletedArticle = await deleteArticleBySlug(slug);
    if (!deletedArticle) {
      res.render(page.error.basic);
    }
    return res.redirect("/publicme");
  }
  res.redirect("/publicme");
}

export function renderWorkshopForm(req: Request, res: Response) {
  res.render(page.publicme.newWorkshop);
}

export async function createWorkshop(req: Request, res: Response) {
  try {
    if (!req.file) {
      console.error("file is not support for create workshop");
      res.render(page.error.basic);
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
    const workshop = await newWorkshop({
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

    if (!workshop) {
      console.error("workshop not created in createWorkshop()");
      res.render(page.error.basic);
    }
    res.redirect("/publicme");
  } catch (e) {
    if (req.file && e instanceof multer.MulterError) {
      console.log("image upload error ");
      res.render(page.error.basic);
    }
    console.error("create workshop error", e);
    res.render(page.error.basic);
  }
}

export async function renderWorkshopUpdateForm(req: Request, res: Response) {
  const slug = req.params.slug;
  const workshop = await getWorkshopBySlug(slug);
  console.log("workshop ", workshop);
  res.render(page.publicme.editWorkshop, { workshop });
}

export async function updateWorkshop(req: Request, res: Response) {
  const userId = req.session.user.userID;
  try {
    const slug = req.params.slug;
    const workshop = await getWorkshopBySlug(slug);
    const updateWorkshop = {
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
    };
    const updatedWorkshop = await updateWorkshopBySlug(slug, updateWorkshop);
    if (!updatedWorkshop) {
      console.error("workshop not updated in updateWorkshop()");
      res.render(page.error.basic);
    }
    res.redirect("/publicme");
  } catch (e) {
    if (req.file && e instanceof multer.MulterError) {
      console.log("image upload error ");
      res.render(page.error.basic);
    }
    console.error("update workshop error", e);
    res.render(page.error.basic);
  }
}

export async function renderWorkshopDeleteConfirm(req: Request, res: Response) {
  const slug = req.params.slug;
  const workshop = await getWorkshopBySlug(slug);
  res.render(page.publicme.confirmDeleteArticle, { item: workshop });
}

export async function deleteWorkshop(req: Request, res: Response) {
  const slug = req.params.slug;
  const workshop = await getWorkshopBySlug(slug);
  if (req.body.type === "delete" && workshop) {
    const deletedWorkshop = await deleteWorkshopBySlug(slug);
    if (!deletedWorkshop) {
      console.log("workshop not deleted 1");
      res.render(page.error.basic);
    }
    return res.redirect("/publicme");
  }
  res.render(page.error.basic);
}
