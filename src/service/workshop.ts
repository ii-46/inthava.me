import DBClient from "../utils/DBClient";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import slugify from "slugify";
import { WorkshopInterface } from "../model/workshop";

/*

model Workshop {
  id          String   @id @default(uuid())
  title       String
  description String
  slug        String   @unique
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  location    String
  link        String
  time        String
  thumbnail   String
  speaker     String
  eventType   String
  detail      String
  status      String
  User        User?    @relation(fields: [userId], references: [id])
  userId      String?
}
*/

export async function getWorkshops() {
  try {
    const workshops = await DBClient.workshop.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });
    return workshops;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.error(e.code, e.message);
    }
    console.error(e);
    return null;
  }
}

export async function newWorkshop(workshop: WorkshopInterface) {
  const title = workshop.title;
  const description = workshop.description;
  const slug = slugify(title, { lower: true, remove: /[*+~.()'"!:@]/g });
  const location = workshop.location;
  const link = workshop.link;
  const time = workshop.time;
  const thumbnail = workshop.thumbnail;
  const speaker = workshop.speaker;
  const eventType = workshop.eventType;
  const detail = workshop.detail;
  const status = workshop.status;
  const userId = workshop.userId;
  try {
    const workshop = await DBClient.workshop.create({
      data: {
        title,
        description,
        slug,
        location,
        link,
        time,
        thumbnail,
        speaker,
        eventType,
        detail,
        status,
        userId
      }
    });
    return workshop;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.error(e.code, e.message);
    }
    console.error(e);
    return null;
  }
}

export async function getWorkshopBySlug(slug: string) {
  try {
    const workshop = await DBClient.workshop.findUnique({
      where: {
        slug
      }
    });
    return workshop;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function updateWorkshopBySlug(slug: string, workshop: WorkshopInterface) {
  try {
    const updatedWorkshop = await DBClient.workshop.update({
      where: {
        slug
      },
      data: workshop
    });
    return updatedWorkshop;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function deleteWorkshopBySlug(slug: string) {
  try {
    const deletedWorkshop = await DBClient.workshop.delete({
      where: {
        slug
      }
    });
    return deletedWorkshop;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getAllPublicWorkshops() {
  try {
    const workshops = await DBClient.workshop.findMany({
      select: {
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
        eventType: true
      },
      where: {
        status: "public"
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return workshops;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getPublicWorkshops(limit: number) {
  try {
    const workshops = await DBClient.workshop.findMany({
      select: {
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
        eventType: true
      },
      where: {
        status: "public"
      },
      orderBy: {
        createdAt: "desc"
      },
      take: limit
    });
    return workshops;
  } catch (e) {
    console.error(e);
    return null;
  }
}