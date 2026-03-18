import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  createAuthor,
  getAllAuthors,
  getAuthor,
  updateAuthor,
  deleteAuthor,
} from "./author.controller";
import * as authorService from "./author.service";
import { createMockRequest, createMockResponse, createMockNextFunction } from "../../config/testMocks";
import CustomError from "../../types/customError";

jest.mock("./author.service");

const mockAuthorService = authorService as jest.Mocked<typeof authorService>;

describe("Author Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createAuthor", () => {
    it("should create a new author", async () => {
      const mockAuthor = { id: 1, name: "John Doe", email: "john@example.com" };
      mockAuthorService.createAuthorService.mockResolvedValue(mockAuthor as any);

      const req = createMockRequest({ body: { name: "John Doe", email: "john@example.com" } });
      const res = createMockResponse();
      const next = createMockNextFunction();

      await createAuthor(req, res, next);

      expect(mockAuthorService.createAuthorService).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: expect.any(String),
        data: mockAuthor,
      });
    });

    it("should call next with error if creation fails", async () => {
      const error = new CustomError("Creation failed", 400);
      mockAuthorService.createAuthorService.mockRejectedValue(error);

      const req = createMockRequest({ body: { name: "John" } });
      const res = createMockResponse();
      const next = createMockNextFunction();

      await createAuthor(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getAllAuthors", () => {
    it("should return all authors", async () => {
      const mockAuthors = [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
      ];
      mockAuthorService.getAllAuthorsService.mockResolvedValue(mockAuthors as any);

      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNextFunction();

      await getAllAuthors(req, res, next);

      expect(mockAuthorService.getAllAuthorsService).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: expect.any(String),
        data: mockAuthors,
      });
    });
  });

  describe("getAuthor", () => {
    it("should return author by id", async () => {
      const mockAuthor = { id: 1, name: "John Doe", email: "john@example.com" };
      mockAuthorService.getAuthorService.mockResolvedValue(mockAuthor as any);

      const req = createMockRequest({ params: { id: "1" } });
      const res = createMockResponse();
      const next = createMockNextFunction();

      await getAuthor(req, res, next);

      expect(mockAuthorService.getAuthorService).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: expect.any(String),
        data: mockAuthor,
      });
    });
  });

  describe("updateAuthor", () => {
    it("should update author successfully", async () => {
      const mockAuthor = { id: 1, name: "John Updated", email: "john@example.com" };
      mockAuthorService.updateAuthorService.mockResolvedValue(mockAuthor as any);

      const req = createMockRequest({
        params: { id: "1" },
        body: { name: "John Updated", email: "john@example.com" },
      });
      const res = createMockResponse();
      const next = createMockNextFunction();

      await updateAuthor(req, res, next);

      expect(mockAuthorService.updateAuthorService).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          name: "John Updated",
        })
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: expect.any(String),
        message: "Author updated successfully",
        data: mockAuthor,
      });
    });
  });

  describe("deleteAuthor", () => {
    it("should delete author successfully", async () => {
      mockAuthorService.deleteAuthorService.mockResolvedValue(null);

      const req = createMockRequest({ params: { id: "1" } });
      const res = createMockResponse();
      const next = createMockNextFunction();

      await deleteAuthor(req, res, next);

      expect(mockAuthorService.deleteAuthorService).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: expect.any(String),
        message: "Author deleted successfully",
      });
    });
  });
});
