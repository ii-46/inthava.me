import { RequestHandler } from "express";
import { getArticlesWithThumbnailByAuthorId } from "../../service/article";
import { getWorkshops } from "../../service/workshop";
import page from "../../views/view";
import { throwIfIsOperational } from "../../error/serviceError";

export const index: RequestHandler = async (req, res) => {
  let message: string | undefined = undefined;
  if (req.query["message"] !== undefined) {
    message = req.query["message"].toString();
  }
  const authorId = req.session.user!.userID;
  let articles:
    | Awaited<ReturnType<typeof getArticlesWithThumbnailByAuthorId>>
    | undefined;
  let workshops: Awaited<ReturnType<typeof getWorkshops>> | undefined;
  try {
    articles = await getArticlesWithThumbnailByAuthorId(authorId);
  } catch (e) {
    throwIfIsOperational(e as Error);
    articles = undefined;
  }
  try {
    workshops = await getWorkshops();
  } catch (e) {
    throwIfIsOperational(e as Error);
    workshops = undefined;
  }
  res.render(page.publicme.index, { articles, workshops, message });
};

/**
 * @throws {Error}
 */
export function notAuthorThanThrow(id: string, authorId: string) {
  if (!(id === authorId)) {
    throw new Error("not author");
  }
}
