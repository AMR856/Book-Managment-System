import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { register, login, logoutJwt, getProfile, logOutSesssion } from "./auth.controller";
import * as authService from "./auth.service";
import * as tokenUtils from "../../utils/createAccessToken";
import { createMockRequest, createMockResponse, createMockNextFunction } from "../../config/testMocks";
import CustomError from "../../types/customError";

jest.mock("./auth.service");
jest.mock("../../utils/createAccessToken");

const mockAuthService = authService as jest.Mocked<typeof authService>;
const mockTokenUtils = tokenUtils as jest.Mocked<typeof tokenUtils>;

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a user without token", async () => {
      const mockUser = { id: 1, email: "user@test.com", role: "user", avatar: null, provider: null };

      mockAuthService.registerUser.mockResolvedValue(mockUser as any);

      const req = createMockRequest({ body: { email: "user@test.com", password: "password123" } });
      const res = createMockResponse();
      const next = createMockNextFunction();

      await register(req, res, next);

      expect(mockAuthService.registerUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: expect.any(String),
        data: {
          user: {
            id: mockUser.id,
            email: mockUser.email,
            avatar: mockUser.avatar,
            provider: mockUser.provider,
            role: mockUser.role,
          },
        },
      });
    });

    it("should call next with error if registration fails", async () => {
      const error = new CustomError("Registration failed", 400);
      mockAuthService.registerUser.mockRejectedValue(error);

      const req = createMockRequest({ body: { email: "user@test.com", password: "password123" } });
      const res = createMockResponse();
      const next = createMockNextFunction();

      await register(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("login", () => {
    it("should login a user and set token in cookie", async () => {
      const mockUser = { id: 1, email: "user@test.com", role: "user", avatar: null, provider: null };
      const mockToken = "mock_token";

      mockAuthService.authenticateUser.mockResolvedValue(mockUser as any);
      mockTokenUtils.createAccessToken.mockReturnValue(mockToken as any);

      const req = createMockRequest({ body: { email: "user@test.com", password: "password123" } });
      const res = createMockResponse();
      const next = createMockNextFunction();

      await login(req, res, next);

      expect(mockAuthService.authenticateUser).toHaveBeenCalledWith(req.body.email, req.body.password);
      expect(mockTokenUtils.createAccessToken).toHaveBeenCalledWith(mockUser);
      expect(res.cookie).toHaveBeenCalledWith("token", mockToken, expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: expect.any(String),
        data: {
          user: {
            id: mockUser.id,
            email: mockUser.email,
            avatar: mockUser.avatar,
            provider: mockUser.provider,
            role: mockUser.role,
          },
          token: mockToken,
        },
      });
    });

    it("should call next with error if authentication fails", async () => {
      const error = new CustomError("Invalid credentials", 401);
      mockAuthService.authenticateUser.mockRejectedValue(error);

      const req = createMockRequest({ body: { email: "user@test.com", password: "wrongpassword" } });
      const res = createMockResponse();
      const next = createMockNextFunction();

      await login(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("logoutJwt", () => {
    it("should clear token cookie and return logout success message", () => {
      const req = createMockRequest();
      const res = createMockResponse();

      logoutJwt(req, res);

      expect(res.clearCookie).toHaveBeenCalledWith("token", expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: expect.any(String),
        message: "Logged out successfully",
      });
    });
  });

  describe("getProfile", () => {
    it("should return user profile from locals", () => {
      const mockUser = { id: 1, email: "user@test.com", role: "user", avatar: null, provider: null };

      const req = createMockRequest();
      const res = createMockResponse({ locals: { user: mockUser } });

      getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: expect.any(String),
        data: {
          user: {
            id: mockUser.id,
            email: mockUser.email,
            avatar: mockUser.avatar,
            provider: mockUser.provider,
            role: mockUser.role,
          },
        },
      });
    });

    it("should throw error if user is not in locals", () => {
      const req = createMockRequest();
      const res = createMockResponse({ locals: { user: null } });

      expect(() => getProfile(req, res)).toThrow("Unauthorized");
    });
  });
});
