import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  createPublisherService,
  getAllPublishersService,
  getPublisherService,
  deletePublisherService,
  updatePublisherService,
} from "./publisher.service";
import * as publisherModel from "./publisher.model";
import CustomError from "../../types/customError";

jest.mock("./publisher.model");

const mockPublisherModel = publisherModel as jest.Mocked<typeof publisherModel>;

describe("Publisher Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createPublisherService", () => {
    it("should successfully create a new publisher", async () => {
      const publisherData = {
        name: "Penguin Books",
        email: "contact@penguin.com",
      };

      mockPublisherModel.getPublisherByEmail.mockResolvedValue(null);
      mockPublisherModel.createPublisher.mockResolvedValue({
        id: 1,
        ...publisherData,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const result = await createPublisherService(publisherData as any);

      expect(mockPublisherModel.getPublisherByEmail).toHaveBeenCalledWith(publisherData.email);
      expect(mockPublisherModel.createPublisher).toHaveBeenCalledWith(publisherData);
      expect(result.id).toBe(1);
    });

    it("should throw error if publisher data is not provided", async () => {
      await expect(createPublisherService(null as any)).rejects.toThrow(CustomError);
    });

    it("should throw error if publisher with email already exists", async () => {
      const publisherData = { name: "Penguin Books", email: "contact@penguin.com" };
      mockPublisherModel.getPublisherByEmail.mockResolvedValue({
        id: 1,
        ...publisherData,
      } as any);

      await expect(createPublisherService(publisherData as any)).rejects.toThrow(
        "A publisher with this email already exist"
      );
    });
  });

  describe("getAllPublishersService", () => {
    it("should return all publishers", async () => {
      const mockPublishers = [
        { id: 1, name: "Penguin Books", email: "contact@penguin.com" },
        { id: 2, name: "Oxford Press", email: "contact@oxford.com" },
      ];

      mockPublisherModel.getAllPublishers.mockResolvedValue(mockPublishers as any);

      const result = await getAllPublishersService();

      expect(mockPublisherModel.getAllPublishers).toHaveBeenCalled();
      expect(result).toEqual(mockPublishers);
      expect(result).toHaveLength(2);
    });
  });

  describe("getPublisherService", () => {
    it("should return publisher by id", async () => {
      const mockPublisher = { id: 1, name: "Penguin Books", email: "contact@penguin.com" };
      mockPublisherModel.getPublisherByID.mockResolvedValue(mockPublisher as any);

      const result = await getPublisherService(1);

      expect(mockPublisherModel.getPublisherByID).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPublisher);
    });

    it("should throw error if id is not provided", async () => {
      await expect(getPublisherService(undefined)).rejects.toThrow(
        "Please include the id of the publisher"
      );
    });

    it("should throw error if publisher not found", async () => {
      mockPublisherModel.getPublisherByID.mockResolvedValue(null);

      await expect(getPublisherService(999)).rejects.toThrow(
        "Publisher with this ID doesn't exist"
      );
    });
  });

  describe("deletePublisherService", () => {
    it("should delete publisher successfully", async () => {
      const mockPublisher = { id: 1, name: "Penguin Books" };
      mockPublisherModel.getPublisherByID.mockResolvedValue(mockPublisher as any);
      mockPublisherModel.deletePublisher.mockResolvedValue(mockPublisher as any);

      const result = await deletePublisherService(1);

      expect(mockPublisherModel.getPublisherByID).toHaveBeenCalledWith(1);
      expect(mockPublisherModel.deletePublisher).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPublisher);
    });

    it("should throw error if publisher not found", async () => {
      mockPublisherModel.getPublisherByID.mockResolvedValue(null);

      await expect(deletePublisherService(999)).rejects.toThrow(
        "Publisher with this ID doesn't exist"
      );
    });
  });

  describe("updatePublisherService", () => {
    it("should update publisher successfully", async () => {
      const publisherData = {
        id: 1,
        name: "Penguin Updated",
        email: "updated@penguin.com",
      };

      mockPublisherModel.getPublisherByID.mockResolvedValue({
        id: 1,
        name: "Penguin Books",
      } as any);
      mockPublisherModel.getPublisherByEmail.mockResolvedValue(null);
      mockPublisherModel.updatePublisher.mockResolvedValue({
        id: 1,
        name: publisherData.name,
        email: publisherData.email,
      } as any);

      const result = await updatePublisherService(publisherData as any);

      expect(mockPublisherModel.getPublisherByID).toHaveBeenCalledWith(1);
      expect(mockPublisherModel.updatePublisher).toHaveBeenCalled();
      expect(result.name).toBe(publisherData.name);
    });

    it("should throw error if id is not provided", async () => {
      const publisherData = { name: "Penguin", email: "penguin@example.com" };
      await expect(updatePublisherService(publisherData as any)).rejects.toThrow(
        "Please include the id of the publisher"
      );
    });

    it("should throw error if publisher not found", async () => {
      const publisherData = { id: 999, name: "Penguin" };
      mockPublisherModel.getPublisherByID.mockResolvedValue(null);

      await expect(updatePublisherService(publisherData as any)).rejects.toThrow(
        "Publisher with this ID doesn't exist"
      );
    });

    it("should throw error if email already exists", async () => {
      const publisherData = {
        id: 1,
        email: "existing@penguin.com",
        name: "Penguin",
      };
      mockPublisherModel.getPublisherByID.mockResolvedValue({
        id: 1,
        name: "Penguin Books",
      } as any);
      mockPublisherModel.getPublisherByEmail.mockResolvedValue({
        id: 2,
        email: publisherData.email,
      } as any);

      await expect(updatePublisherService(publisherData as any)).rejects.toThrow(
        "Can't have two publishers with the same email"
      );
    });
  });
});
