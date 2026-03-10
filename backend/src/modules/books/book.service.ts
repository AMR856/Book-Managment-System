import {
  getBookByID,
  getAllBooks,
  getBookByISBN,
  createBook,
  updateBook,
  deleteBook,
} from "./book.model";

import { getAuthorByID } from "../authors/author.model";
import { getPublisherByID } from "../publishers/publisher.model";
import { BookData } from "../../types/bookData";
import CustomError from "../../types/customError";
import HttpMessages from "../../types/statusMessages";

export const createBookService = async (data: BookData) => {
  if (!data) {
    throw new CustomError("Please, include the body of the request", 400, HttpMessages.FAIL);
  }

  const isExist = await getBookByISBN(data.isbn);
  if (isExist) {
    throw new CustomError("A book with this ISBN already exists", 409, HttpMessages.FAIL);
  }
  await checkAuthorAndPublisher(data.authorId, data.publisherId);
  return createBook(data);
};

export const getAllBooksService = async () => {
  return getAllBooks();
};

export const getBookService = async (id: number | undefined) => {
  if (!id) {
    throw new CustomError("Please include the id of the book", 400, HttpMessages.FAIL);
  }

  const book = await getBookByID(id);
  if (!book) {
    throw new CustomError("Book with this ID doesn't exist", 404, HttpMessages.FAIL);
  }

  return book;
};

export const deleteBookService = async (id: number | undefined) => {
  if (!id) {
    throw new CustomError("Please include the id of the book", 400, HttpMessages.FAIL);
  }

  const book = await getBookByID(id);
  if (!book) {
    throw new CustomError("Book with this ID doesn't exist", 404, HttpMessages.FAIL);
  }

  return deleteBook(id);
};

export const updateBookService = async (data: BookData) => {
  const { createdAt, updatedAt, id, ...safeData } = data;
  if (!id) {
    throw new CustomError("Please include the id of the book", 400, HttpMessages.FAIL);
  }
  const book = await getBookByID(id);
  if (!book) {
    throw new CustomError("Book with this ID doesn't exist", 404, HttpMessages.FAIL);
  }
  if (safeData.isbn) {
    const bookWithSameISBN = await getBookByISBN(safeData.isbn);
    if (bookWithSameISBN && bookWithSameISBN.id !== id) {
      throw new CustomError("A book with this ISBN already exists", 409, HttpMessages.FAIL);
    }
  }
  await checkAuthorAndPublisher(safeData.authorId, safeData.publisherId);
  return updateBook(id, safeData);
};

const checkAuthorAndPublisher = async (
  authorId: number,
  publisherId: number
) => {
  const isAuthorExist = await getAuthorByID(authorId);
  if (!isAuthorExist) {
    throw new CustomError("An author with this ID doesn't exist", 400, HttpMessages.FAIL);
  }

  const isPublisherExist = await getPublisherByID(publisherId);
  if (!isPublisherExist) {
    throw new CustomError("A publisher with this ID doesn't exist", 400, HttpMessages.FAIL);
  }
};