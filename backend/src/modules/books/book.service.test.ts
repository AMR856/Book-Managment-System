import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  createBookService,
  getAllBooksService,
  getBookService,
  deleteBookService,
  updateBookService,
} from "./book.service";
import * as bookModel from "./book.model";
import * as authorModel from "../authors/author.model";
import * as publisherModel from "../publishers/publisher.model";
import CustomError from "../../types/customError";

jest.mock("./book.model");
jest.mock("../authors/author.model");
jest.mock("../publishers/publisher.model");

const mockBookModel = bookModel as jest.Mocked<typeof bookModel>;
const mockAuthorModel = authorModel as jest.Mocked<typeof authorModel>;
const mockPublisherModel = publisherModel as jest.Mocked<typeof publisherModel>;

describe("Book Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createBookService", () => {
    it("should successfully create a new book", async () => {
      const bookData = {
        title: "The Book",
        isbn: "123-456",
        authorId: 1,
        publisherId: 1,
        quantity: 10,
      };

      mockBookModel.getBookByISBN.mockResolvedValue(null);
      mockAuthorModel.getAuthorByID.mockResolvedValue({ id: 1 } as any);
      mockPublisherModel.getPublisherByID.mockResolvedValue({ id: 1 } as any);
      mockBookModel.createBook.mockResolvedValue({
        id: 1,
        ...bookData,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const result = await createBookService(bookData as any);

      expect(mockBookModel.getBookByISBN).toHaveBeenCalledWith(bookData.isbn);
      expect(mockAuthorModel.getAuthorByID).toHaveBeenCalledWith(bookData.authorId);
      expect(mockPublisherModel.getPublisherByID).toHaveBeenCalledWith(bookData.publisherId);
      expect(mockBookModel.createBook).toHaveBeenCalledWith(bookData);
      expect(result.id).toBe(1);
    });

    it("should throw error if book data is not provided", async () => {
      await expect(createBookService(null as any)).rejects.toThrow(CustomError);
    });

    it("should throw error if book with ISBN already exists", async () => {
      const bookData = { title: "The Book", isbn: "123-456", authorId: 1, publisherId: 1 };
      mockBookModel.getBookByISBN.mockResolvedValue({ id: 1, ...bookData } as any);

      await expect(createBookService(bookData as any)).rejects.toThrow(
        "A book with this ISBN already exists"
      );
    });

    it("should throw error if author does not exist", async () => {
      const bookData = { title: "The Book", isbn: "123-456", authorId: 999, publisherId: 1 };
      mockBookModel.getBookByISBN.mockResolvedValue(null);
      mockAuthorModel.getAuthorByID.mockResolvedValue(null);

      await expect(createBookService(bookData as any)).rejects.toThrow(
        "An author with this ID doesn't exist"
      );
    });

    it("should throw error if publisher does not exist", async () => {
      const bookData = { title: "The Book", isbn: "123-456", authorId: 1, publisherId: 999 };
      mockBookModel.getBookByISBN.mockResolvedValue(null);
      mockAuthorModel.getAuthorByID.mockResolvedValue({ id: 1 } as any);
      mockPublisherModel.getPublisherByID.mockResolvedValue(null);

      await expect(createBookService(bookData as any)).rejects.toThrow(
        "A publisher with this ID doesn't exist"
      );
    });
  });

  describe("getAllBooksService", () => {
    it("should return all books", async () => {
      const mockBooks = [
        { id: 1, title: "Book 1", isbn: "123-456" },
        { id: 2, title: "Book 2", isbn: "789-012" },
      ];

      mockBookModel.getAllBooks.mockResolvedValue(mockBooks as any);

      const result = await getAllBooksService();

      expect(mockBookModel.getAllBooks).toHaveBeenCalled();
      expect(result).toEqual(mockBooks);
    });
  });

  describe("getBookService", () => {
    it("should return book by id", async () => {
      const mockBook = { id: 1, title: "The Book", isbn: "123-456" };
      mockBookModel.getBookByID.mockResolvedValue(mockBook as any);

      const result = await getBookService(1);

      expect(mockBookModel.getBookByID).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockBook);
    });

    it("should throw error if id is not provided", async () => {
      await expect(getBookService(undefined)).rejects.toThrow("Please include the id of the book");
    });

    it("should throw error if book not found", async () => {
      mockBookModel.getBookByID.mockResolvedValue(null);

      await expect(getBookService(999)).rejects.toThrow("Book with this ID doesn't exist");
    });
  });

  describe("deleteBookService", () => {
    it("should delete book successfully", async () => {
      const mockBook = { id: 1, title: "The Book" };
      mockBookModel.getBookByID.mockResolvedValue(mockBook as any);
      mockBookModel.deleteBook.mockResolvedValue(mockBook as any);

      const result = await deleteBookService(1);

      expect(mockBookModel.getBookByID).toHaveBeenCalledWith(1);
      expect(mockBookModel.deleteBook).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockBook);
    });

    it("should throw error if book not found", async () => {
      mockBookModel.getBookByID.mockResolvedValue(null);

      await expect(deleteBookService(999)).rejects.toThrow("Book with this ID doesn't exist");
    });
  });

  describe("updateBookService", () => {
    it("should update book successfully", async () => {
      const bookData = {
        id: 1,
        title: "Updated Book",
        isbn: "123-456",
        authorId: 1,
        publisherId: 1,
      };

      mockBookModel.getBookByID.mockResolvedValue({ id: 1, title: "The Book" } as any);
      mockBookModel.getBookByISBN.mockResolvedValue(null);
      mockAuthorModel.getAuthorByID.mockResolvedValue({ id: 1 } as any);
      mockPublisherModel.getPublisherByID.mockResolvedValue({ id: 1 } as any);
      mockBookModel.updateBook.mockResolvedValue({
        id: 1,
        title: bookData.title,
        isbn: bookData.isbn,
      } as any);

      const result = await updateBookService(bookData as any);

      expect(mockBookModel.getBookByID).toHaveBeenCalledWith(1);
      expect(mockBookModel.updateBook).toHaveBeenCalled();
      expect(result.title).toBe(bookData.title);
    });

    it("should throw error if book not found", async () => {
      const bookData = { id: 999, title: "Book" };
      mockBookModel.getBookByID.mockResolvedValue(null);

      await expect(updateBookService(bookData as any)).rejects.toThrow(
        "Book with this ID doesn't exist"
      );
    });

    it("should throw error if ISBN already exists for different book", async () => {
      const bookData = { id: 1, isbn: "existing-isbn", title: "Updated Book", authorId: 1, publisherId: 1 };
      mockBookModel.getBookByID.mockResolvedValue({ id: 1, isbn: "old-isbn" } as any);
      mockBookModel.getBookByISBN.mockResolvedValue({ id: 2, isbn: bookData.isbn } as any);

      await expect(updateBookService(bookData as any)).rejects.toThrow(
        "A book with this ISBN already exists"
      );
    });
  });
});
