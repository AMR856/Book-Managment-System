import { Request, Response, NextFunction } from "express";
import HttpMessages from "../types/statusMessages";


export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let statusCode = err.statusCode ?? 500;
  let message = err.message ?? "Internal Server Error";
  let statusText = err.statusText ?? HttpMessages.ERROR;
  if (err.name === "ZodError") {
    statusCode = 400;
    message = err.errors
      .map((e: any) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    statusText = HttpMessages.FAIL;
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
    statusText = HttpMessages.FAIL;
  }

  res.status(statusCode).json({
    status: statusText,
    message,
  });
};