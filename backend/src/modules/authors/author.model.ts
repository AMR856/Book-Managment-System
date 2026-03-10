import { AuthorData } from "../../types/authorData";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export const createAuthor = async (data: AuthorData) => {
  return await prisma.authors.create({ data });
};

export const deleteAuthor = async (id: number | undefined) => {
  return await prisma.authors.delete({
    where: { id },
  });
};

export const getAuthorByID = (id: number) => {
  return prisma.authors.findUnique({
    where: { id },
    include: {
      books: true,
    },
  });
};

export const getAuthorByEmail = async (email: string) => {
  return await prisma.authors.findUnique({
    where: { email },
  });
};

export const getAllAuthors = async () => {
  return prisma.authors.findMany({
    include: {
      books: true,
    },
  });
};

export const updateAuthor = async (
  id: number | undefined,
  data: AuthorData,
) => {
  return await prisma.authors.update({
    where: { id },
    data,
  });
};
