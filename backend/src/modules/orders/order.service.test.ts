import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  createOrderService,
  getOrdersService,
  getOrderService,
  deleteOrderService,
} from "./order.service";
import * as authModel from "../auth/auth.model";
import * as bookModel from "../books/book.model";
import * as orderModel from "./order.model";
import CustomError from "../../types/customError";

jest.mock("../auth/auth.model");
jest.mock("../books/book.model");
jest.mock("./order.model");

const mockAuthModel = authModel as jest.Mocked<typeof authModel>;
const mockBookModel = bookModel as jest.Mocked<typeof bookModel>;
const mockOrderModel = orderModel as jest.Mocked<typeof orderModel>;

describe("Order Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createOrderService", () => {
    it("should successfully create a new order", async () => {
      const orderData = { bookId: 1, quantity: 5 };
      const userId = 1;

      mockAuthModel.getUserByID.mockResolvedValue({ id: userId } as any);
      mockBookModel.getBookByID.mockResolvedValue({
        id: 1,
        quantity: 10,
      } as any);
      mockOrderModel.createOrderWithStockUpdate.mockResolvedValue({
        id: 1,
        userId,
        bookId: 1,
        quantity: 5,
      } as any);

      const result = await createOrderService(userId, orderData as any);

      expect(mockAuthModel.getUserByID).toHaveBeenCalledWith(userId);
      expect(mockBookModel.getBookByID).toHaveBeenCalledWith(1);
      expect(mockOrderModel.createOrderWithStockUpdate).toHaveBeenCalledWith(
        userId,
        1,
        5,
        5
      );
      expect(result.id).toBe(1);
    });

    it("should throw error if order data is not provided", async () => {
      await expect(createOrderService(1, null as any)).rejects.toThrow(CustomError);
    });

    it("should throw error if user does not exist", async () => {
      mockAuthModel.getUserByID.mockResolvedValue(null);

      await expect(
        createOrderService(999, { bookId: 1, quantity: 5 } as any)
      ).rejects.toThrow("User does not exist");
    });

    it("should throw error if book does not exist", async () => {
      mockAuthModel.getUserByID.mockResolvedValue({ id: 1 } as any);
      mockBookModel.getBookByID.mockResolvedValue(null);

      await expect(
        createOrderService(1, { bookId: 999, quantity: 5 } as any)
      ).rejects.toThrow("Book does not exist");
    });

    it("should throw error if not enough quantity available", async () => {
      mockAuthModel.getUserByID.mockResolvedValue({ id: 1 } as any);
      mockBookModel.getBookByID.mockResolvedValue({
        id: 1,
        quantity: 3,
      } as any);

      await expect(
        createOrderService(1, { bookId: 1, quantity: 5 } as any)
      ).rejects.toThrow("Not enough quantity available for this book");
    });
  });

  describe("getOrdersService", () => {
    it("should return all orders if user is admin", async () => {
      const mockOrders = [
        { id: 1, userId: 1, bookId: 1, quantity: 5 },
        { id: 2, userId: 2, bookId: 2, quantity: 3 },
      ];
      mockOrderModel.getAllOrders.mockResolvedValue(mockOrders as any);

      const result = await getOrdersService(1, "admin");

      expect(mockOrderModel.getAllOrders).toHaveBeenCalled();
      expect(result).toEqual(mockOrders);
    });

    it("should return user orders if user is not admin", async () => {
      const mockOrders = [{ id: 1, userId: 1, bookId: 1, quantity: 5 }];
      mockOrderModel.getOrdersByUserId.mockResolvedValue(mockOrders as any);

      const result = await getOrdersService(1, "user");

      expect(mockOrderModel.getOrdersByUserId).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockOrders);
    });
  });

  describe("getOrderService", () => {
    it("should return order if user is admin", async () => {
      const mockOrder = { id: 1, userId: 2, bookId: 1, quantity: 5 };
      mockOrderModel.getOrderByID.mockResolvedValue(mockOrder as any);

      const result = await getOrderService(1, 1, "admin");

      expect(mockOrderModel.getOrderByID).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockOrder);
    });

    it("should return order if belongs to user", async () => {
      const mockOrder = { id: 1, userId: 1, bookId: 1, quantity: 5 };
      mockOrderModel.getOrderByID.mockResolvedValue(mockOrder as any);

      const result = await getOrderService(1, 1, "user");

      expect(mockOrderModel.getOrderByID).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockOrder);
    });

    it("should throw error if order not found", async () => {
      mockOrderModel.getOrderByID.mockResolvedValue(null);

      await expect(getOrderService(999, 1, "admin")).rejects.toThrow(
        "Order with this ID doesn't exist"
      );
    });

    it("should throw forbidden error if user tries to access other user's order", async () => {
      const mockOrder = { id: 1, userId: 2, bookId: 1, quantity: 5 };
      mockOrderModel.getOrderByID.mockResolvedValue(mockOrder as any);

      await expect(getOrderService(1, 1, "user")).rejects.toThrow("Forbidden");
    });
  });

  describe("deleteOrderService", () => {
    it("should delete order if user is admin", async () => {
      const mockOrder = { id: 1, userId: 2, bookId: 1, quantity: 5 };
      mockOrderModel.getOrderByID.mockResolvedValue(mockOrder as any);
      mockOrderModel.deleteOrderAndRestoreStock.mockResolvedValue(null);

      await deleteOrderService(1, 1, "admin");

      expect(mockOrderModel.deleteOrderAndRestoreStock).toHaveBeenCalledWith(1, 1, 5);
    });

    it("should delete order if belongs to user", async () => {
      const mockOrder = { id: 1, userId: 1, bookId: 1, quantity: 5 };
      mockOrderModel.getOrderByID.mockResolvedValue(mockOrder as any);
      mockOrderModel.deleteOrderAndRestoreStock.mockResolvedValue(null);

      await deleteOrderService(1, 1, "user");

      expect(mockOrderModel.deleteOrderAndRestoreStock).toHaveBeenCalledWith(1, 1, 5);
    });

    it("should throw forbidden error if user tries to delete other user's order", async () => {
      const mockOrder = { id: 1, userId: 2, bookId: 1, quantity: 5 };
      mockOrderModel.getOrderByID.mockResolvedValue(mockOrder as any);

      await expect(deleteOrderService(1, 1, "user")).rejects.toThrow("Forbidden");
    });
  });
});
