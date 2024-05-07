import DBClient from "../utils/DBClient";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Article, UpdateArticle } from "../model/article";
import { titleSlug } from "../utils/slug";
import { ServiceError } from "../error/serviceError";

const selectedColumnForList = {
  id: true,
  slug: true,
  title: true,
  createdAt: true,
  updatedAt: true,
  category: true,
} as const;

const selectedColumnForListWithImage = {
  id: true,
  slug: true,
  title: true,
  thumbnail: true,
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
    const err = e as Error;
    if (err instanceof PrismaClientKnownRequestError) {
      throw new ServiceError("CreateArticleError", err.message);
    }
    throw new ServiceError("CreateArticleError", err.message, false);
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
    const err = e as Error;
    if (err instanceof PrismaClientKnownRequestError) {
      throw new ServiceError("GetArticleBySlugError", errorArticleNotFound);
    }
    throw new ServiceError("GetArticleBySlugError", err.message, false);
  }
}

/**
 * @throws {ServiceError}
 */
export async function getArticles() {
  try {
    return await DBClient.article.findMany({
      select: selectedColumnForList,
      orderBy: {
        updatedAt: "desc",
      },
    });
  } catch (e) {
    const err = e as Error;
    if (err instanceof PrismaClientKnownRequestError) {
      throw new ServiceError("GetArticlesError", errorArticlesNotFound);
    }
    throw new ServiceError("GetArticlesError", err.message, false);
  }
}

/**
 * @throws {ServiceError}
 */
export async function getArticlesWithThumbnailByAuthorId(authorId: string) {
  try {
    return await DBClient.article.findMany({
      select: selectedColumnForListWithImage,
      where: {
        authorId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  } catch (e) {
    const err = e as Error;
    if (err instanceof PrismaClientKnownRequestError) {
      throw new ServiceError(
        "GetArticlesByAuthorIdError",
        errorArticlesNotFound,
      );
    }
    throw new ServiceError("GetArticlesByAuthorIdError", err.message, false);
  }
}

/**
 * @throws {ServiceError}
 */
export async function getArticlesByAuthorName(authorName: string) {
  try {
    return await DBClient.article.findMany({
      select: selectedColumnForList,
      where: {
        authorName,
      },
    });
  } catch (e) {
    const err = e as Error;
    if (err instanceof PrismaClientKnownRequestError) {
      throw new ServiceError(
        "GetArticlesByAuthorNameError",
        errorArticlesNotFound,
      );
    }
    throw new ServiceError("GetArticlesByAuthorNameError", err.message, false);
  }
}

/**
 * @throws {ServiceError}
 */
export async function getArticlesByCategory(category: string) {
  try {
    return await DBClient.article.findMany({
      select: selectedColumnForList,
      where: {
        category,
      },
    });
  } catch (e) {
    const err = e as Error;
    if (err instanceof PrismaClientKnownRequestError) {
      throw new ServiceError(
        "GetArticlesByCategoryError",
        errorArticlesNotFound,
      );
    }
    throw new ServiceError("GetArticlesByCategoryError", err.message, false);
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
    const err = e as Error;
    if (err instanceof PrismaClientKnownRequestError) {
      throw new ServiceError("UpdateArticleBySlugError", err.message);
    }
    throw new ServiceError("UpdateArticleBySlugError", err.message, false);
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
    const err = e as Error;
    if (err instanceof PrismaClientKnownRequestError) {
      throw new ServiceError("DeleteArticleBySlugError", err.message);
    }
    throw new ServiceError("DeleteArticleBySlugError", err.message, false);
  }
}

/**
 * @throws {ServiceError}
 */
export async function getAllPublicArticles() {
  try {
    return await DBClient.article.findMany({
      select: selectedColumnForList,
      where: {
        status: "public",
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  } catch (e) {
    const err = e as Error;
    if (err instanceof PrismaClientKnownRequestError) {
      throw new ServiceError(
        "GetAllPublicArticlesError",
        errorArticlesNotFound,
      );
    }
    throw new ServiceError("GetAllPublicArticlesError", err.message, false);
  }
}

/**
 * @throws {ServiceError}
 */
export async function getPublicArticles(limit: number) {
  try {
    return await DBClient.article.findMany({
      select: selectedColumnForList,
      where: {
        status: "public",
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: limit,
    });
  } catch (e) {
    const err = e as Error;
    if (err instanceof PrismaClientKnownRequestError) {
      throw new ServiceError("GetPublicArticlesError", errorArticlesNotFound);
    }
    throw new ServiceError("GetPublicArticlesError", err.message, false);
  }
}

/**
 * @throws {ServiceError}
 */
export function getSearchedArticles(word: string) {
  try {
    return DBClient.article.findMany({
      select: selectedColumnForList,
      where: {
        status: "public",
        title: {
          contains: word,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  } catch (e) {
    const err = e as Error;
    if (err instanceof PrismaClientKnownRequestError) {
      throw new ServiceError("GetSearchedArticlesError", errorArticlesNotFound);
    }
    throw new ServiceError("GetSearchedArticlesError", err.message, false);
  }
}
