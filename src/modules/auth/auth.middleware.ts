import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getUserByID } from "./auth.model";
import CustomError from "../../types/customError";
import HttpMessages from "../../types/statusMessages";


export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomError("Unauthorized", 401, HttpMessages.FAIL);
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new CustomError("Unauthorized", 401, HttpMessages.FAIL);
  }

  const jwtSecret: string = process.env.JWT_SECRET ?? "NIGGA";


  try {
    const payload = jwt.verify(token, jwtSecret as string) as JwtPayload;
    const user = await getUserByID(payload.userId);

    if (!user) {
      throw new CustomError("Unauthorized", 401, HttpMessages.FAIL);
    }

    res.locals.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export const authorizeRole = (role: "admin" | "user") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;
    if (!user) {
      throw new CustomError("Unauthorized", 401, HttpMessages.FAIL);
    }

    const userRole = (user.role as string) ?? "user";
    if (userRole !== role) {
      throw new CustomError("Forbidden", 403, HttpMessages.FAIL);
    }

    next();
  };
};
