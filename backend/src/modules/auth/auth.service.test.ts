import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import bcrypt from "bcrypt";
import { registerUser, authenticateUser } from "./auth.service";
import * as authModel from "./auth.model";
import CustomError from "../../types/customError";

jest.mock("bcrypt");
jest.mock("./auth.model");

const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ADMIN_EMAILS = "admin@test.com";
  });

  describe("registerUser", () => {
    it("should successfully register a new user with user role", async () => {
      const userData = { email: "user@test.com", password: "password123" };
      const hashedPassword = "hashed_password";

      (authModel.getUserByEmail as jest.Mock).mockResolvedValue(null as never);
      mockBcrypt.hash.mockResolvedValue(hashedPassword as never);
      (authModel.createUser as jest.Mock).mockResolvedValue({
        id: 1,
        email: userData.email,
        password: hashedPassword,
        role: "user",
      } as never);

      const result = await registerUser(userData);

      expect(authModel.getUserByEmail).toHaveBeenCalledWith(userData.email);
      expect(mockBcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(authModel.createUser).toHaveBeenCalledWith({
        email: userData.email,
        password: hashedPassword,
        role: "user",
      });
      expect(result.role).toBe("user");
    });

    it("should register user with admin role if email is in admin list", async () => {
      const userData = { email: "admin@test.com", password: "password123" };
      const hashedPassword = "hashed_password";

      (authModel.getUserByEmail as jest.Mock).mockResolvedValue(null as never);
      mockBcrypt.hash.mockResolvedValue(hashedPassword as never);
      (authModel.createUser as jest.Mock).mockResolvedValue({
        id: 1,
        email: userData.email,
        password: hashedPassword,
        role: "admin",
      } as never);

      const result = await registerUser(userData);

      expect(result.role).toBe("admin");
    });

    it("should throw error if user data is not provided", async () => {
      await expect(registerUser(null as any)).rejects.toThrow(CustomError);
    });

    it("should throw error if user already exists", async () => {
      const userData = { email: "existing@test.com", password: "password123" };
      (authModel.getUserByEmail as jest.Mock).mockResolvedValue({
        id: 1,
        email: userData.email,
      } as never);

      await expect(registerUser(userData)).rejects.toThrow("User with this email already exists");
    });
  });

  describe("authenticateUser", () => {
    it("should successfully authenticate user with correct credentials", async () => {
      const email = "user@test.com";
      const password = "password123";
      const hashedPassword = "hashed_password";

      (authModel.getUserByEmail as jest.Mock).mockResolvedValue({
        id: 1,
        email,
        password: hashedPassword,
      } as never);
      mockBcrypt.compare.mockResolvedValue(true as never);

      const result = await authenticateUser(email, password);

      expect(authModel.getUserByEmail).toHaveBeenCalledWith(email);
      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result.id).toBe(1);
      expect(result.email).toBe(email);
    });

    it("should throw error if user does not exist", async () => {
      const email = "nonexistent@test.com";
      const password = "password123";

      (authModel.getUserByEmail as jest.Mock).mockResolvedValue(null as never);

      await expect(authenticateUser(email, password)).rejects.toThrow(
        "Invalid email or password"
      );
    });

    it("should throw error if password is incorrect", async () => {
      const email = "user@test.com";
      const password = "wrongpassword";
      const hashedPassword = "hashed_password";

      (authModel.getUserByEmail as jest.Mock).mockResolvedValue({
        id: 1,
        email,
        password: hashedPassword,
      } as never);
      mockBcrypt.compare.mockResolvedValue(false as never);

      await expect(authenticateUser(email, password)).rejects.toThrow(
        "Invalid email or password"
      );
    });

    it("should throw error if user has no password", async () => {
      const email = "user@test.com";
      const password = "password123";

      (authModel.getUserByEmail as jest.Mock).mockResolvedValue({
        id: 1,
        email,
        password: null,
      } as never);

      await expect(authenticateUser(email, password)).rejects.toThrow(
        "Invalid email or password"
      );
    });
  });
});
