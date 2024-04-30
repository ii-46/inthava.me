import DBClient from "../utils/DBClient";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { comparePassword, hashPassword } from "../utils/password";
import { UpdateUser, User } from "../model/user";
import { emptyCollection, notFound, ServiceError } from "../error/serviceError";

export const errorUserNotFound = "User not found";
export const errorUsersNotFound = "Users not found";
/**
 * @throws {ServiceError}
 */
export async function newUser(user: User) {
  user.password = hashPassword(user.password);
  try {
    await DBClient.user.create({
      data: {
        ...user,
      },
    });
  } catch (e) {
    throw new ServiceError("CreateUserError", e.message);
  }
}

/**
 * @throws {ServiceError}
 */
export async function getUserByEmail(email: string) {
  try {
    return await DBClient.user.findUniqueOrThrow({
      where: {
        email,
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      throw new ServiceError("GetUserByEmailError", errorUserNotFound);
    }
    throw new ServiceError("GetUserByEmailError", e.message, false);
  }
}

/**
 * @throws {ServiceError}
 */
export async function getUserById(id: string) {
  try {
    return await DBClient.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      throw new ServiceError("GetUserByIdError", errorUserNotFound);
    }
    throw new ServiceError("GetUserByIdError", e.message, false);
  }
}

/**
 * @throws {ServiceError}
 */
export async function getAllUser() {
  try {
    const users = await DBClient.user.findMany();
    emptyCollection("GetAllUserError", users);
    return users;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      throw new ServiceError("GetAllUserError", errorUsersNotFound);
    }
    throw new ServiceError("GetAllUserError", e.message, false);
  }
}

/**
 * @throws {ServiceError}
 */
export async function updateUser(user: UpdateUser) {
  try {
    await DBClient.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...user.user,
      },
    });
    return user;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        throw new ServiceError("UpdateUserError", errorUserNotFound);
      }
    }
    throw new ServiceError("UpdateUserError", e.message, false);
  }
}

/**
 * @throws {ServiceError}
 */
export async function deleteUser(id: string) {
  try {
    await DBClient.user.delete({
      where: {
        id,
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        throw new ServiceError("DeleteUserError", errorUserNotFound);
      }
    }
    throw new ServiceError("DeleteUserError", e.message, false);
  }
}

/**
 * @throws {ServiceError}
 */
export async function getUserByEmailAndPassword(
  email: string,
  password: string,
) {
  try {
    const user = await DBClient.user.findUniqueOrThrow({
      where: {
        email,
      },
    });
    if (user) {
      if (comparePassword(password, user.password)) {
        return user;
      }
    }
    notFound("GetUserByEmailAndPasswordError", "User");
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      notFound("GetUserByEmailAndPasswordError", "User");
    }
    throw new ServiceError("GetUserByEmailAndPasswordError", e.message, false);
  }
}
