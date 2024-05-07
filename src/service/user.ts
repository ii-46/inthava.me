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
    const err = e as Error;
    if (err instanceof PrismaClientKnownRequestError) {
      throw new ServiceError("CreateUserError", err.message);
    }
    throw new ServiceError("CreateUserError", err.message, false);
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
    const err = e as Error;
    if (err instanceof PrismaClientKnownRequestError) {
      throw new ServiceError("GetUserByEmailError", errorUserNotFound);
    }
    throw new ServiceError("GetUserByEmailError", err.message, false);
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
    const err = e as Error;
    if (err instanceof PrismaClientKnownRequestError) {
      throw new ServiceError("GetUserByIdError", errorUserNotFound);
    }
    throw new ServiceError("GetUserByIdError", err.message, false);
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
    const err = e as Error;
    if (err instanceof PrismaClientKnownRequestError) {
      throw new ServiceError("GetAllUserError", errorUsersNotFound);
    }
    throw new ServiceError("GetAllUserError", err.message, false);
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
    const err = e as Error;
    if (err instanceof PrismaClientKnownRequestError) {
      throw new ServiceError("UpdateUserError", errorUserNotFound);
    }
    throw new ServiceError("UpdateUserError", err.message, false);
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
    const err = e as Error;
    if (err instanceof PrismaClientKnownRequestError) {
      throw new ServiceError("DeleteUserError", errorUserNotFound);
    }
    throw new ServiceError("DeleteUserError", err.message, false);
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
    notFound("GetUserByEmailAndPasswordError", errorUserNotFound);
  } catch (e) {
    const err = e as Error;
    if (err instanceof PrismaClientKnownRequestError) {
      notFound("GetUserByEmailAndPasswordError", errorUserNotFound);
    }
    throw new ServiceError(
      "GetUserByEmailAndPasswordError",
      err.message,
      false,
    );
  }
}
