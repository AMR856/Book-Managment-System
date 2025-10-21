import {
  createAuthorService,
  getAllAuthorsService,
  getAuthorService,
  deleteAuthorService,
  updateAuthorService,
} from "./author.service";
import { Request, Response, NextFunction } from "express";
import HttpMessages from "../utils/statusMessages";

export const createAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body);
    const newAuthor = await createAuthorService(req.body);
    res.status(201).json({
      status: HttpMessages.SUCCESS,
      data: newAuthor,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllAuthors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authors = await getAllAuthorsService();
    res.status(200).json({
      status: HttpMessages.SUCCESS,
      data: authors,
    });
  } catch (err) {
    next(err);
  }
};

export const getAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const author = await getAuthorService(Number(req.params.id));
    res.status(200).json({
      status: HttpMessages.SUCCESS,
      data: author,
    });
  } catch (err) {
    next(err);
  }
};

export const updateAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updated = await updateAuthorService({
      id: Number(req.params.id),
      ...req.body,
    });
    res.status(200).json({
      status: "success",
      message: "Author updated successfully",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteAuthorService(Number(req.params.id));
    res.status(200).json({
      status: HttpMessages.SUCCESS,
      message: "Author deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
