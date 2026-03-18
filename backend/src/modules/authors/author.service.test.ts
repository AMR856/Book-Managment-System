import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  createAuthorService,
  getAllAuthorsService,
  getAuthorService,
  deleteAuthorService,
  updateAuthorService,
} from "./author.service";
import * as authorModel from "./author.model";
import CustomError from "../../types/customError";

jest.mock("./author.model");

const mockAuthorModel = authorModel as jest.Mocked<typeof authorModel>;

describe("Author Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createAuthorService", () => {
    it("should successfully create a new author", async () => {
      const authorData = {
        name: "John Doe",
        email: "john@example.com",
        bio: "A great author",
      };

      mockAuthorModel.getAuthorByEmail.mockResolvedValue(null);
      mockAuthorModel.createAuthor.mockResolvedValue({
        id: 1,
        ...authorData,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const result = await createAuthorService(authorData as any);

      expect(mockAuthorModel.getAuthorByEmail).toHaveBeenCalledWith(authorData.email);
      expect(mockAuthorModel.createAuthor).toHaveBeenCalledWith(authorData);
      expect(result.id).toBe(1);
    });

    it("should throw error if author data is not provided", async () => {
      await expect(createAuthorService(null as any)).rejects.toThrow(CustomError);
    });

    it("should throw error if author with email already exists", async () => {
      const authorData = { name: "Jane Doe", email: "jane@example.com" };
      mockAuthorModel.getAuthorByEmail.mockResolvedValue({ id: 1, ...authorData } as any);

      await expect(createAuthorService(authorData as any)).rejects.toThrow(
        "An author with this email already exist"
      );
    });
  });

  describe("getAllAuthorsService", () => {
    it("should return all authors", async () => {
      const mockAuthors = [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
      ];

      mockAuthorModel.getAllAuthors.mockResolvedValue(mockAuthors as any);

      const result = await getAllAuthorsService();

      expect(mockAuthorModel.getAllAuthors).toHaveBeenCalled();
      expect(result).toEqual(mockAuthors);
      expect(result).toHaveLength(2);
    });
  });

  describe("getAuthorService", () => {
    it("should return author by id", async () => {
      const mockAuthor = { id: 1, name: "John Doe", email: "john@example.com" };
      mockAuthorModel.getAuthorByID.mockResolvedValue(mockAuthor as any);

      const result = await getAuthorService(1);

      expect(mockAuthorModel.getAuthorByID).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockAuthor);
    });

    it("should throw error if id is not provided", async () => {
      await expect(getAuthorService(undefined)).rejects.toThrow(
        "Please include the id of the publisher"
      );
    });

    it("should throw error if author not found", async () => {
      mockAuthorModel.getAuthorByID.mockResolvedValue(null);

      await expect(getAuthorService(999)).rejects.toThrow("Author with this ID doesn't exist");
    });
  });

  describe("deleteAuthorService", () => {
    it("should delete author successfully", async () => {
      const mockAuthor = { id: 1, name: "John Doe" };
      mockAuthorModel.getAuthorByID.mockResolvedValue(mockAuthor as any);
      mockAuthorModel.deleteAuthor.mockResolvedValue(mockAuthor as any);

      const result = await deleteAuthorService(1);

      expect(mockAuthorModel.getAuthorByID).toHaveBeenCalledWith(1);
      expect(mockAuthorModel.deleteAuthor).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockAuthor);
    });

    it("should throw error if author not found", async () => {
      mockAuthorModel.getAuthorByID.mockResolvedValue(null);

      await expect(deleteAuthorService(999)).rejects.toThrow("Author with this ID doesn't exist");
    });
  });

  describe("updateAuthorService", () => {
    it("should update author successfully", async () => {
      const authorData = {
        id: 1,
        name: "John Updated",
        email: "johnupdated@example.com",
      };

      mockAuthorModel.getAuthorByID.mockResolvedValue({ id: 1, name: "John Doe" } as any);
      mockAuthorModel.getAuthorByEmail.mockResolvedValue(null);
      mockAuthorModel.updateAuthor.mockResolvedValue({
        id: 1,
        name: authorData.name,
        email: authorData.email,
      } as any);

      const result = await updateAuthorService(authorData as any);

      expect(mockAuthorModel.getAuthorByID).toHaveBeenCalledWith(1);
      expect(mockAuthorModel.updateAuthor).toHaveBeenCalledWith(1, expect.any(Object));
      expect(result.name).toBe(authorData.name);
    });

    it("should throw error if id is not provided", async () => {
      const authorData = { name: "John", email: "john@example.com" };
      await expect(updateAuthorService(authorData as any)).rejects.toThrow(
        "Please include the id of the publisher"
      );
    });

    it("should throw error if author not found", async () => {
      const authorData = { id: 999, name: "John" };
      mockAuthorModel.getAuthorByID.mockResolvedValue(null);

      await expect(updateAuthorService(authorData as any)).rejects.toThrow(
        "Author with this ID doesn't exist"
      );
    });

    it("should throw error if email already exists", async () => {
      const authorData = { id: 1, email: "existing@example.com", name: "John" };
      mockAuthorModel.getAuthorByID.mockResolvedValue({ id: 1, name: "John Doe" } as any);
      mockAuthorModel.getAuthorByEmail.mockResolvedValue({ id: 2, email: authorData.email } as any);

      await expect(updateAuthorService(authorData as any)).rejects.toThrow(
        "Can't have two authors with the same email"
      );
    });
  });
});
