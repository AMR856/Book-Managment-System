const { PrismaClient } = require("@prisma/client");
import { BookData } from "../types/bookData";
const prisma = new PrismaClient();

export const createBook = async (data: BookData) => {
  return prisma.books.create({
    data: {
      title: data.title,
      isbn: data.isbn,
      year: data.year,
      genre: data.genre,
      available: data.available,
      author: {
        connect: { id: data.authorId },
      },
      publisher: {
        connect: { id: data.publisherId },
      },
    },
  });
};

export const getAllBooks = async () => {
  return prisma.books.findMany({
    include: {
      author: true,
      publisher: true,
    },
  });
};

export const getBookByID = async (id: number) => {
  return prisma.books.findUnique({
    where: { id },
    include: {
      author: true,
      publisher: true,
    },
  });
};

export const getBookByISBN = async (isbn: string) => {
  return prisma.books.findUnique({
    where: { isbn },
  });
};

export const updateBook = async (id: number, data: Partial<BookData>) => {
  return prisma.books.update({
    where: { id },
    data: {
      title: data.title,
      isbn: data.isbn,
      year: data.year,
      genre: data.genre,
      available: data.available,
      authorId: data.authorId,
      publisherId: data.publisherId,
    },
  });
};

export const deleteBook = async (id: number) => {
  return prisma.books.delete({
    where: { id },
  });
};
