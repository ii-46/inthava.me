import DBClient from "../utils/DBClient";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { comparePassword, hashPassword } from "../utils/password";
import { UpdateUser, User } from "../model/user";
import { emptyCollection, notFound, ServiceError } from "../error/serviceError";
import { throws } from "node:assert";
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
      throw new ServiceError("GetUserByEmailError", "User not found");
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
      throw new ServiceError("GetUserByIdError", "User not found");
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
      throw new ServiceError("GetAllUserError", "Users not found");
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
        throw new ServiceError("UpdateUserError", "User not found");
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
        throw new ServiceError("DeleteUserError", "User not found");
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
