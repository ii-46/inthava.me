import DBClient from "../utils/DBClient";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { UpdateWorkshop, Workshop } from "../model/workshop";
import { ServiceError } from "../error/serviceError";
import { titleSlug } from "../utils/slug";

/**
 * @throws {ServiceError}
 */
export async function getWorkshops() {
  try {
    return await DBClient.workshop.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      throw new ServiceError("GetWorkshopsError", e.message);
    }
    throw new ServiceError("GetWorkshopsError", e.message, false);
  }
}

/**
 * @throws {ServiceError}
 */
export async function newWorkshop(workshop: Workshop) {
  try {
    await DBClient.workshop.create({
      data: {
        ...workshop,
        slug: titleSlug(workshop.title),
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      throw new ServiceError("NewWorkshopError", e.message);
    }
    throw new ServiceError("NewWorkshopError", e.message, false);
  }
}

/**
 * @throws {ServiceError}
 */
export async function getWorkshopBySlug(slug: string) {
  try {
    return await DBClient.workshop.findUniqueOrThrow({
      where: {
        slug,
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      throw new ServiceError("GetWorkshopBySlugError", e.message);
    }
    throw new ServiceError("GetWorkshopBySlugError", e.message, false);
  }
}

/**
 * @throws {ServiceError}
 */
export async function updateWorkshopBySlug(workshop: UpdateWorkshop) {
  try {
    await DBClient.workshop.update({
      where: {
        slug: workshop.slug,
        version: workshop.version,
      },
      data: workshop,
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      throw new ServiceError("UpdateWorkshopBySlugError", e.message);
    }
    throw new ServiceError("UpdateWorkshopBySlugError", e.message, false);
  }
}

/**
 * @throws {ServiceError}
 */
export async function deleteWorkshopBySlug(slug: string) {
  try {
    return await DBClient.workshop.delete({
      where: {
        slug,
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      throw new ServiceError("DeleteWorkshopBySlugError", e.message);
    }
    throw new ServiceError("DeleteWorkshopBySlugError", e.message, false);
  }
}

const selectedAllColumns = {
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
  title: true,
  description: true,
  location: true,
  link: true,
  time: true,
  thumbnail: true,
  speaker: true,
  eventType: true,
} as const;

/**
 * @throws {ServiceError}
 */
export async function getAllPublicWorkshops() {
  try {
    return await DBClient.workshop.findMany({
      select: selectedAllColumns,
      where: {
        status: "public",
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      throw new ServiceError("GetAllPublicWorkshopsError", e.message);
    }
    throw new ServiceError("GetAllPublicWorkshopsError", e.message, false);
  }
}

/**
 * @throws {ServiceError}
 */
export async function getPublicWorkshops(limit: number) {
  try {
    return await DBClient.workshop.findMany({
      select: selectedAllColumns,
      where: {
        status: "public",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      throw new ServiceError("GetPublicWorkshopsError", e.message);
    }
    throw new ServiceError("GetPublicWorkshopsError", e.message, false);
  }
}
