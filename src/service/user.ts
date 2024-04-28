import DBClient from "../utils/DBClient";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { comparePassword, hashPassword } from "../utils/password";
import { UserInterface } from "../model/user";

export async function newUser(user: UserInterface) {
  const email = user.email;
  const name = user.name;
  const password = hashPassword(user.password);
  try {
    const user = await DBClient.user.create({
      data: {
        email,
        name,
        password
      }
    });
    return user;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.log(e.code, e.message);
    }
    return null;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await DBClient.user.findUnique({
      where: {
        email
      }
    });
    return user;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.log(e.code, e.message);
    }
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    const user = await DBClient.user.findUnique({
      where: {
        id
      }
    });
    return user;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.log(e.code, e.message);
    }
    return null;
  }
}

export async function getAllUser() {
  try {
    const users = await DBClient.user.findMany();
    return users;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.log(e.code, e.message);
    }
    return null;
  }
}

export async function updateUser(id: string, user: UserInterface) {
  const email = user.email;
  const name = user.name;
  const password = user.password;
  try {
    const user = await DBClient.user.update({
      where: {
        id
      },
      data: {
        email,
        name,
        password
      }
    });
    return user;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.log(e.code, e.message);
    }
    return null;
  }
}

export async function deleteUser(id: string) {
  try {
    const user = await DBClient.user.delete({
      where: {
        id
      }
    });
    return user;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.log(e.code, e.message);
    }
    return null;
  }
}

export async function getUserByEmailAndPassword(email: string, password: string) {
  try {
    const user = await DBClient.user.findUnique({
      where: {
        email
      }
    });
    if (user) {
      if (comparePassword(password, user.password)) {
        return user;
      }
    }
    return null;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.log(e.code, e.message);
    }
    return null;
  }
}