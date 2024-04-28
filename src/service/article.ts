import DBClient from "../utils/DBClient";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import slugify from "slugify";
import { ArticleInterface } from "../model/article";

export async function newArticle(article: ArticleInterface) {
  const title = article.title;
  const content = article.content;
  const slug = slugify(title, { lower: true, remove: /[*+~.()'"!:@]/g });
  const category = article.category;
  const tags = article.tags;
  const thumbnail = article.thumbnail;
  const description = article.description;
  const status = article.status;
  const authorId = article.authorId;
  const authorName = article.authorName;
  try {
    return await DBClient.article.create({
      data: {
        title,
        content,
        slug,
        category,
        tags,
        thumbnail,
        description,
        status,
        authorId,
        authorName
      }
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.error(e.code, e.message);
    }
    return null;
  }
}

export async function getArticleBySlug(slug: string) {
  try {
    const article = await DBClient.article.findUnique({
      where: {
        slug
      }
    });
    return article;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.error(e.code, e.message);
    }
    return null;
  }
}

export async function getArticles() {
  try {
    const articles = await DBClient.article.findMany({
      orderBy: {
        updatedAt: "desc"
      }
    });
    return articles;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.error(e.code, e.message);
    }
    return null;
  }
}

export async function getArticlesByAuthorId(authorId: string) {
  try {
    const articles = await DBClient.article.findMany({
      where: {
        authorId
      }
    });
    return articles;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.error(e.code, e.message);
    }
    return null;
  }
}

export async function getArticlesByAuthorName(authorName: string) {
  try {
    const articles = await DBClient.article.findMany({
      where: {
        authorName
      }
    });
    return articles;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.error(e.code, e.message);
    }
    return null;
  }
}

export async function getArticlesByCategory(category: string) {
  try {
    const articles = await DBClient.article.findMany({
      where: {
        category
      }
    });
    return articles;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.error(e.code, e.message);
    }
    return null;
  }
}

export async function getArticlesByTag(tag: string) {
  try {
    const articles = await DBClient.article.findMany({
      where: {
        tags: {
          has: tag
        }
      }
    });
    return articles;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.error(e.code, e.message);
    }
    return null;
  }
}

export async function getArticlesByStatus(status: string) {
  try {
    const articles = await DBClient.article.findMany({
      where: {
        status
      }
    });
    return articles;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.error(e.code, e.message);
    }
    return null;
  }
}

export async function updateArticleBySlug(slug: string, article: ArticleInterface) {
  const title = article.title;
  const content = article.content;
  const category = article.category;
  const tags = article.tags;
  const thumbnail = article.thumbnail;
  const description = article.description;
  const status = article.status;
  const authorId = article.authorId;
  const authorName = article.authorName;
  try {
    const article = await DBClient.article.update({

      where: {
        slug
      },
      data: {
        title,
        content,
        category,
        tags,
        thumbnail,
        description,
        status,
        authorId,
        authorName
      }
    });
    return article;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.error(e.code, e.message);
    }
    return null;
  }
}

export async function deleteArticleBySlug(slug: string) {
  try {
    const article = await DBClient.article.delete({
      where: {
        slug
      }
    });
    return article;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.error(e.code, e.message);
    }
  }
}


export async function getAllPublicArticles() {
  try {
    const articles = await DBClient.article.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        category: true
      },
      where: {
        status: "public"
      },
      orderBy: {
        updatedAt: "desc"
      }
    });
    return articles;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getPublicArticles(limit: number) {
  try {
    const articles = await DBClient.article.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        category: true
      },
      where: {
        status: "public"
      },
      orderBy: {
        updatedAt: "desc"
      },
      take: limit
    });
    return articles;
  } catch (e) {
    console.error(e);
    return null;
  }
}