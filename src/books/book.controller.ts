import {
  createBookService,
  getAllBooksService,
  getBookService,
  deleteBookService,
  updateBookService,
} from "./book.service";
import { Request, Response, NextFunction } from "express";
import HttpMessages from "../utils/statusMessages";

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newBook = await createBookService(req.body);
    res.status(201).json({
      status: HttpMessages.SUCCESS,
      data: newBook,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllBooks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authors = await getAllBooksService();
    res.status(200).json({
      status: HttpMessages.SUCCESS,
      data: authors,
    });
  } catch (err) {
    next(err);
  }
};

export const getBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const author = await getBookService(Number(req.params.id));
    res.status(200).json({
      status: HttpMessages.SUCCESS,
      data: author,
    });
  } catch (err) {
    next(err);
  }
};

export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const updated = await updateBookService({
      id: Number(req.params.id),
      ...req.body,
    });
    res.status(200).json({
      status: "success",
      message: "Book updated successfully",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await deleteBookService(Number(req.params.id));
    res.status(200).json({
      status: HttpMessages.SUCCESS,
      message: "Book deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
