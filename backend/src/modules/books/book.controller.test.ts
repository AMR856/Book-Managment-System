import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  createBook,
  getAllBooks,
  getBook,
  updateBook,
  deleteBook,
} from "./book.controller";
import * as bookService from "./book.service";
import { createMockRequest, createMockResponse, createMockNextFunction } from "../../config/testMocks";
import CustomError from "../../types/customError";

jest.mock("./book.service");

const mockBookService = bookService as jest.Mocked<typeof bookService>;

describe("Book Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createBook", () => {
    it("should create a new book", async () => {
      const mockBook = { id: 1, title: "The Book", isbn: "123-456", quantity: 10 };
      mockBookService.createBookService.mockResolvedValue(mockBook as any);

      const req = createMockRequest({
        body: { title: "The Book", isbn: "123-456", authorId: 1, publisherId: 1, quantity: 10 },
      });
      const res = createMockResponse();
      const next = createMockNextFunction();

      await createBook(req, res, next);

      expect(mockBookService.createBookService).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: expect.any(String),
        data: mockBook,
      });
    });

    it("should call next with error if creation fails", async () => {
      const error = new CustomError("Creation failed", 400);
      mockBookService.createBookService.mockRejectedValue(error);

      const req = createMockRequest({ body: { title: "The Book" } });
      const res = createMockResponse();
      const next = createMockNextFunction();

      await createBook(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getAllBooks", () => {
    it("should return all books", async () => {
      const mockBooks = [
        { id: 1, title: "Book 1", isbn: "123-456" },
        { id: 2, title: "Book 2", isbn: "789-012" },
      ];
      mockBookService.getAllBooksService.mockResolvedValue(mockBooks as any);

      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNextFunction();

      await getAllBooks(req, res, next);

      expect(mockBookService.getAllBooksService).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: expect.any(String),
        data: mockBooks,
      });
    });
  });

  describe("getBook", () => {
    it("should return book by id", async () => {
      const mockBook = { id: 1, title: "The Book", isbn: "123-456" };
      mockBookService.getBookService.mockResolvedValue(mockBook as any);

      const req = createMockRequest({ params: { id: "1" } });
      const res = createMockResponse();
      const next = createMockNextFunction();

      await getBook(req, res, next);

      expect(mockBookService.getBookService).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: expect.any(String),
        data: mockBook,
      });
    });
  });

  describe("updateBook", () => {
    it("should update book successfully", async () => {
      const mockBook = { id: 1, title: "Updated Book", isbn: "123-456" };
      mockBookService.updateBookService.mockResolvedValue(mockBook as any);

      const req = createMockRequest({
        params: { id: "1" },
        body: { title: "Updated Book", isbn: "123-456" },
      });
      const res = createMockResponse();
      const next = createMockNextFunction();

      await updateBook(req, res, next);

      expect(mockBookService.updateBookService).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          title: "Updated Book",
        })
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: expect.any(String),
        message: "Book updated successfully",
        data: mockBook,
      });
    });
  });

  describe("deleteBook", () => {
    it("should delete book successfully", async () => {
      mockBookService.deleteBookService.mockResolvedValue(null);

      const req = createMockRequest({ params: { id: "1" } });
      const res = createMockResponse();
      const next = createMockNextFunction();

      await deleteBook(req, res, next);

      expect(mockBookService.deleteBookService).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: expect.any(String),
        message: "Book deleted successfully",
      });
    });
  });
});
