import CustomError from "../types/customError";
import HttpMessages from "../types/statusMessages";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

export const createAccessToken = (user: any) => {
  if (!jwtSecret) {
    throw new CustomError("JWT_SECRET environment variable is not defined", 500, HttpMessages.FAIL);
  }

  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role ?? "user",
    },
    jwtSecret,
    { expiresIn: "1h" },
  );
};