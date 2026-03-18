import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  createOrder,
  getOrders,
  getOrder,
  deleteOrder,
} from "./order.controller";
import * as orderService from "./order.service";
import { createMockRequest, createMockResponse, createMockNextFunction } from "../../config/testMocks";
import CustomError from "../../types/customError";

jest.mock("./order.service");

const mockOrderService = orderService as jest.Mocked<typeof orderService>;

describe("Order Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createOrder", () => {
    it("should create a new order", async () => {
      const mockOrder = { id: 1, userId: 1, bookId: 1, quantity: 5 };
      const mockUser = { id: 1, role: "user" };

      mockOrderService.createOrderService.mockResolvedValue(mockOrder as any);

      const req = createMockRequest({
        body: { bookId: 1, quantity: 5 },
      });
      const res = createMockResponse({ locals: { user: mockUser } });
      const next = createMockNextFunction();

      await createOrder(req, res, next);

      expect(mockOrderService.createOrderService).toHaveBeenCalledWith(
        mockUser.id,
        req.body
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: expect.any(String),
        data: mockOrder,
      });
    });

    it("should call next with error if creation fails", async () => {
      const error = new CustomError("Creation failed", 400);
      mockOrderService.createOrderService.mockRejectedValue(error);

      const req = createMockRequest({ body: { bookId: 1, quantity: 5 } });
      const res = createMockResponse({ locals: { user: { id: 1 } } });
      const next = createMockNextFunction();

      await createOrder(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getOrders", () => {
    it("should return orders for user", async () => {
      const mockOrders = [{ id: 1, userId: 1, bookId: 1, quantity: 5 }];
      const mockUser = { id: 1, role: "user" };

      mockOrderService.getOrdersService.mockResolvedValue(mockOrders as any);

      const req = createMockRequest();
      const res = createMockResponse({ locals: { user: mockUser } });
      const next = createMockNextFunction();

      await getOrders(req, res, next);

      expect(mockOrderService.getOrdersService).toHaveBeenCalledWith(
        mockUser.id,
        mockUser.role
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: expect.any(String),
        data: mockOrders,
      });
    });

    it("should return all orders for admin", async () => {
      const mockOrders = [
        { id: 1, userId: 1, bookId: 1, quantity: 5 },
        { id: 2, userId: 2, bookId: 2, quantity: 3 },
      ];
      const mockUser = { id: 1, role: "admin" };

      mockOrderService.getOrdersService.mockResolvedValue(mockOrders as any);

      const req = createMockRequest();
      const res = createMockResponse({ locals: { user: mockUser } });
      const next = createMockNextFunction();

      await getOrders(req, res, next);

      expect(mockOrderService.getOrdersService).toHaveBeenCalledWith(
        mockUser.id,
        "admin"
      );
      expect(res.json).toHaveBeenCalledWith({
        status: expect.any(String),
        data: mockOrders,
      });
    });
  });

  describe("getOrder", () => {
    it("should return order by id", async () => {
      const mockOrder = { id: 1, userId: 1, bookId: 1, quantity: 5 };
      const mockUser = { id: 1, role: "user" };

      mockOrderService.getOrderService.mockResolvedValue(mockOrder as any);

      const req = createMockRequest({ params: { id: "1" } });
      const res = createMockResponse({ locals: { user: mockUser } });
      const next = createMockNextFunction();

      await getOrder(req, res, next);

      expect(mockOrderService.getOrderService).toHaveBeenCalledWith(
        1,
        mockUser.id,
        mockUser.role
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: expect.any(String),
        data: mockOrder,
      });
    });
  });

  describe("deleteOrder", () => {
    it("should delete order successfully", async () => {
      const mockUser = { id: 1, role: "user" };

      mockOrderService.deleteOrderService.mockResolvedValue(null);

      const req = createMockRequest({ params: { id: "1" } });
      const res = createMockResponse({ locals: { user: mockUser } });
      const next = createMockNextFunction();

      await deleteOrder(req, res, next);

      expect(mockOrderService.deleteOrderService).toHaveBeenCalledWith(
        1,
        mockUser.id,
        mockUser.role
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: expect.any(String),
        message: "Order deleted successfully",
      });
    });
  });
});
