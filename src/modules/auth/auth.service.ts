import bcrypt from "bcrypt";
import CustomError from "../../types/customError";
import { createUser, getUserByEmail } from "./auth.model";
import { UserData } from "../../types/userData";
import HttpMessages from "../../types/statusMessages";

const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());

const resolveRole = (email: string): "admin" | "user" => {
  return adminEmails.includes(email.toLowerCase()) ? "admin" : "user";
};

export const registerUser = async (data: { email: string; password: string }) => {
  if (!data) {
    throw new CustomError("Please provide user data", 400, HttpMessages.FAIL);
  }

  const existingUser = await getUserByEmail(data.email);
  if (existingUser) {
    throw new CustomError("User with this email already exists", 409, HttpMessages.FAIL);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const userData: UserData = {
    email: data.email,
    password: hashedPassword,
    role: resolveRole(data.email),
  };

  return createUser(userData);
};

export const authenticateUser = async (email: string, password: string) => {
  const user = await getUserByEmail(email);
  if (!user || !user.password) {
    throw new CustomError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new CustomError("Invalid email or password", 401, HttpMessages.FAIL);
  }

  return user;
};
