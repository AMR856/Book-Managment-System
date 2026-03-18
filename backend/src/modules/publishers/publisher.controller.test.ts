import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  createPublisher,
  getAllPublishers,
  getPublisher,
  updatePublisher,
  deletePublisher,
} from "./publisher.controller";
import * as publisherService from "./publisher.service";
import { createMockRequest, createMockResponse, createMockNextFunction } from "../../config/testMocks";
import CustomError from "../../types/customError";

jest.mock("./publisher.service");

const mockPublisherService = publisherService as jest.Mocked<typeof publisherService>;

describe("Publisher Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createPublisher", () => {
    it("should create a new publisher", async () => {
      const mockPublisher = {
        id: 1,
        name: "Penguin Books",
        email: "contact@penguin.com",
      };
      mockPublisherService.createPublisherService.mockResolvedValue(mockPublisher as any);

      const req = createMockRequest({
        body: { name: "Penguin Books", email: "contact@penguin.com" },
      });
      const res = createMockResponse();
      const next = createMockNextFunction();

      await createPublisher(req, res, next);

      expect(mockPublisherService.createPublisherService).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: expect.any(String),
        data: mockPublisher,
      });
    });

    it("should call next with error if creation fails", async () => {
      const error = new CustomError("Creation failed", 400);
      mockPublisherService.createPublisherService.mockRejectedValue(error);

      const req = createMockRequest({ body: { name: "Penguin" } });
      const res = createMockResponse();
      const next = createMockNextFunction();

      await createPublisher(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getAllPublishers", () => {
    it("should return all publishers", async () => {
      const mockPublishers = [
        { id: 1, name: "Penguin Books", email: "contact@penguin.com" },
        { id: 2, name: "Oxford Press", email: "contact@oxford.com" },
      ];
      mockPublisherService.getAllPublishersService.mockResolvedValue(mockPublishers as any);

      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNextFunction();

      await getAllPublishers(req, res, next);

      expect(mockPublisherService.getAllPublishersService).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: expect.any(String),
        data: mockPublishers,
      });
    });
  });

  describe("getPublisher", () => {
    it("should return publisher by id", async () => {
      const mockPublisher = {
        id: 1,
        name: "Penguin Books",
        email: "contact@penguin.com",
      };
      mockPublisherService.getPublisherService.mockResolvedValue(mockPublisher as any);

      const req = createMockRequest({ params: { id: "1" } });
      const res = createMockResponse();
      const next = createMockNextFunction();

      await getPublisher(req, res, next);

      expect(mockPublisherService.getPublisherService).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: expect.any(String),
        data: mockPublisher,
      });
    });
  });

  describe("updatePublisher", () => {
    it("should update publisher successfully", async () => {
      const mockPublisher = {
        id: 1,
        name: "Penguin Updated",
        email: "updated@penguin.com",
      };
      mockPublisherService.updatePublisherService.mockResolvedValue(mockPublisher as any);

      const req = createMockRequest({
        params: { id: "1" },
        body: { name: "Penguin Updated", email: "updated@penguin.com" },
      });
      const res = createMockResponse();
      const next = createMockNextFunction();

      await updatePublisher(req, res, next);

      expect(mockPublisherService.updatePublisherService).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          name: "Penguin Updated",
        })
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: expect.any(String),
        message: "Publisher updated successfully",
        data: mockPublisher,
      });
    });
  });

  describe("deletePublisher", () => {
    it("should delete publisher successfully", async () => {
      mockPublisherService.deletePublisherService.mockResolvedValue(null);

      const req = createMockRequest({ params: { id: "1" } });
      const res = createMockResponse();
      const next = createMockNextFunction();

      await deletePublisher(req, res, next);

      expect(mockPublisherService.deletePublisherService).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: expect.any(String),
        message: "Publisher deleted successfully",
      });
    });
  });
});
