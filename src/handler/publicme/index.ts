import { RequestHandler } from "express";
import { getArticlesWithThumbnailByAuthorId } from "../../service/article";
import { getWorkshops } from "../../service/workshop";
import page from "../../views/view";
import { ServiceError } from "../../error/serviceError";

export const index: RequestHandler = async (req, res) => {
  const authorId = req.session.user.userID;
  let articles:
    | Awaited<ReturnType<typeof getArticlesWithThumbnailByAuthorId>>
    | undefined;
  let workshops: Awaited<ReturnType<typeof getWorkshops>> | undefined;
  try {
    articles = await getArticlesWithThumbnailByAuthorId(authorId);
  } catch (e) {
    throwIfIsOperational(e);
    articles = undefined;
  }
  try {
    workshops = await getWorkshops();
  } catch (e) {
    throwIfIsOperational(e);
    workshops = undefined;
  }
  res.render(page.publicme.index, { articles, workshops });
};

/**
 * @throws {ServiceError}
 */
function throwIfIsOperational(e: Error) {
  if (e instanceof ServiceError) {
    if (!e.isOperational) {
      throw e;
    }
  }
}
