const { PrismaClient } = require("@prisma/client");
import { AuthorData } from "../types/authorData";
const prisma = new PrismaClient();

export const createAuthor = async (data: AuthorData) => {
  return await prisma.authors.create({ data });
};

export const deleteAuthor = async (id: Number | undefined) => {
  return await prisma.authors.delete({
    where: { id },
  });
};

export const getAuthorByID = async (id: Number | undefined) => {
  return await prisma.authors.findUnique({
    where: { id },
  });
};

export const getAuthorByEmail = async (email: string) => {
  return await prisma.authors.findUnique({
    where: { email },
  });
};

export const getAllAuthors = async () => {
  return await prisma.authors.findMany();
};

export const updateAuthor = async (
  id: string | undefined,
  data: AuthorData
) => {
  return await prisma.authors.update({
    where: { id },
    data,
  });
};
