import {
  getAuthorByEmail,
  getAllAuthors,
  getAuthorByID,
  createAuthor,
  deleteAuthor,
  updateAuthor,
} from "./author.model";
import CustomError from "../types/customError";
import { AuthorData } from "../types/authorData";

export const createAuthorService = async (data: AuthorData) => {
  const isExist = await getAuthorByEmail(data.email);
  if (isExist) {
    throw new CustomError("An author with this email already exist", 409);
  }
  return createAuthor(data);
};

export const getAllAuthorsService = async () => {
  return getAllAuthors();
};

export const getAuthorService = async (id: Number | undefined) => {
  const author = await getAuthorByID(id);
  if (!author) {
    throw new CustomError("Author with this ID doesn't exist", 404);
  }
  return author;
};

export const deleteAuthorService = async (id: Number | undefined) => {
  const author = await getAuthorByID(id);
  if (!author) {
    throw new CustomError("Author with this ID doesn't exist", 404);
  }
  return await deleteAuthor(id);
};

export const updateAuthorService = async (data: AuthorData) => {
  const { createdAt, updatedAt, id, ...safeData } = data;
  const authorID = await getAuthorByID(Number(id));
  if (!authorID) {
    throw new CustomError("Author with this ID doesn't exist", 404);
  }
  const authorEmail = await getAuthorByEmail(safeData.email);
  if (authorEmail) {
    throw new CustomError("Can't have two authors with the same email", 400);
  }
  return await updateAuthor(id, safeData);
};
