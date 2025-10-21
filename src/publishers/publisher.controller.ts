import {
  createPublisherService,
  getAllPublishersService,
  getPublisherService,
  deletePublisherService,
  updatePublisherService,
} from './publisher.service';
import { Request, Response, NextFunction } from "express";
import HttpMessages from "../utils/statusMessages";

export const createPublisher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newPublisher = await createPublisherService(req.body);
    res.status(201).json({
      status: HttpMessages.SUCCESS,
      data: newPublisher,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllPublishers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const publishers = await getAllPublishersService();
    res.status(200).json({
      status: HttpMessages.SUCCESS,
      data: publishers,
    });
  } catch (err) {
    next(err);
  }
};

export const getPublisher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const publisher = await getPublisherService(Number(req.params.id));
    res.status(200).json({
      status: HttpMessages.SUCCESS,
      data: publisher,
    });
  } catch (err) {
    next(err);
  }
};

export const updatePublisher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updated = await updatePublisherService({
      id: Number(req.params.id),
      ...req.body,
    });
    res.status(200).json({
      status: "success",
      message: "Publisher updated successfully",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deletePublisher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deletePublisherService(Number(req.params.id));
    res.status(200).json({
      status: HttpMessages.SUCCESS,
      message: "Publisher deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
