const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
import { UserData } from "../types/userData";

export const createUser = async (data: UserData) => {
  return await prisma.users.create({ data });
};

export const deleteUser = async (id: Number | undefined) => {
  return await prisma.users.delete({
    where: { id },
  });
};

export const getAllUsers = async () => {
  return await prisma.users.findMany();
};

export const getUserByID = async (id: Number | undefined) => {
  return await prisma.users.findUnique({
    where: { id },
  });
};

export const getUserByEmail = async (email: string) => {
  return await prisma.users.findUnique({
    where: { email },
  });
};

export const updateAuthor = async (
  id: string | undefined,
  data: UserData
) => {
  return await prisma.users.update({
    where: { id },
    data,
  });
};
