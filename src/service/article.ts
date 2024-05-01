import DBClient from "../utils/DBClient";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Article, UpdateArticle } from "../model/article";
import { titleSlug } from "../utils/slug";
import { ServiceError } from "../error/serviceError";

const selectedColumn = {
  id: true,
  slug: true,
  title: true,
  createdAt: true,
  updatedAt: true,
  category: true,
} as const;
export const errorArticleNotFound = "Article not found";
export const errorArticlesNotFound = "Articles not found";

/**
 * @throws {ServiceError}
 */
export async function newArticle(article: Article) {
  try {
    await DBClient.article.create({
      data: {
        ...article,
        slug: titleSlug(article.title),
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      throw new ServiceError("CreateArticleError", e.message);
    }
    throw new ServiceError("CreateArticleError", e.message, false);
  }
}

/**
 * @throws {ServiceError}
 */
export async function getArticleBySlug(slug: string) {
  try {
    return await DBClient.article.findUniqueOrThrow({
      where: {
        slug,
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      throw new ServiceError("GetArticleBySlugError", errorArticleNotFound);
    }
    throw new ServiceError("GetArticleBySlugError", e.message, false);
  }
}

/**
 * @throws {ServiceError}
 */
export async function getArticles() {
  try {
    return await DBClient.article.findMany({
      select: selectedColumn,
      orderBy: {
        updatedAt: "desc",
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      throw new ServiceError("GetArticlesError", errorArticlesNotFound);
    }
    throw new ServiceError("GetArticlesError", e.message, false);
  }
}

/**
 * @throws {ServiceError}
 */
export async function getArticlesByAuthorId(authorId: string) {
  try {
    return await DBClient.article.findMany({
      select: selectedColumn,
      where: {
        authorId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      throw new ServiceError(
        "GetArticlesByAuthorIdError",
        errorArticlesNotFound,
      );
    }
    throw new ServiceError("GetArticlesByAuthorIdError", e.message, false);
  }
}

/**
 * @throws {ServiceError}
 */
export async function getArticlesByAuthorName(authorName: string) {
  try {
    return await DBClient.article.findMany({
      select: selectedColumn,
      where: {
        authorName,
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      throw new ServiceError(
        "GetArticlesByAuthorNameError",
        errorArticlesNotFound,
      );
    }
    throw new ServiceError("GetArticlesByAuthorNameError", e.message, false);
  }
}

/**
 * @throws {ServiceError}
 */
export async function getArticlesByCategory(category: string) {
  try {
    return await DBClient.article.findMany({
      select: selectedColumn,
      where: {
        category,
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      throw new ServiceError(
        "GetArticlesByCategoryError",
        errorArticlesNotFound,
      );
    }
    throw new ServiceError("GetArticlesByCategoryError", e.message, false);
  }
}

/**
 * @throws {ServiceError}
 */
export async function updateArticleBySlug(article: UpdateArticle) {
  try {
    await DBClient.article.update({
      where: {
        slug: article.slug,
        version: article.version,
      },
      data: {
        ...article,
        version: article.version + 1,
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      throw new ServiceError("UpdateArticleBySlugError", e.message);
    }
    throw new ServiceError("UpdateArticleBySlugError", e.message, false);
  }
}

/**
 * @throws {ServiceError}
 */
export async function deleteArticleBySlug(slug: string) {
  try {
    await DBClient.article.delete({
      where: {
        slug,
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      throw new ServiceError("DeleteArticleBySlugError", e.message);
    }
    throw new ServiceError("DeleteArticleBySlugError", e.message, false);
  }
}

/**
 * @throws {ServiceError}
 */
export async function getAllPublicArticles() {
  try {
    return await DBClient.article.findMany({
      select: selectedColumn,
      where: {
        status: "public",
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      throw new ServiceError(
        "GetAllPublicArticlesError",
        errorArticlesNotFound,
      );
    }
    throw new ServiceError("GetAllPublicArticlesError", e.message, false);
  }
}

/**
 * @throws {ServiceError}
 */
export async function getPublicArticles(limit: number) {
  try {
    return await DBClient.article.findMany({
      select: selectedColumn,
      where: {
        status: "public",
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: limit,
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      throw new ServiceError("GetPublicArticlesError", errorArticlesNotFound);
    }
    throw new ServiceError("GetPublicArticlesError", e.message, false);
  }
}
