import { OrderData } from "../../types/orderData";
import CustomError from "../../types/customError";
import HttpMessages from "../../types/statusMessages";
import { getUserByID } from "../auth/auth.model";
import { getBookByID } from "../books/book.model";
import {
  getAllOrders,
  getOrderByID,
  getOrdersByUserId,
  createOrderWithStockUpdate,
  deleteOrderAndRestoreStock,
} from "./order.model";

export const createOrderService = async (
  userId: number,
  data: OrderData
) => {
  if (!data) {
    throw new CustomError("Please, include the body of the request", 400, HttpMessages.FAIL);
  }

  const user = await getUserByID(userId);
  if (!user) {
    throw new CustomError("User does not exist", 404, HttpMessages.FAIL);
  }
  const bookId = Number(data.bookId);
  const quantity = Number(data.quantity);

  if (!bookId || Number.isNaN(bookId)) {
    throw new CustomError("Invalid bookId", 400, HttpMessages.FAIL);
  }

  if (!quantity || Number.isNaN(quantity) || quantity <= 0) {
    throw new CustomError("Quantity must be a positive number", 400, HttpMessages.FAIL);
  }

  const book = await getBookByID(bookId);
  if (!book) {
    throw new CustomError("Book does not exist", 404, HttpMessages.FAIL);
  }

  if (book.quantity < quantity) {
    throw new CustomError("Not enough quantity available for this book", 400, HttpMessages.FAIL);
  }

  const newQuantity = book.quantity - quantity;

  const order = await createOrderWithStockUpdate(userId, bookId, quantity, newQuantity);
  return order;
};

export const getOrdersService = async (userId: number, role: string) => {
  if (role === "admin") {
    return getAllOrders();
  }
  return getOrdersByUserId(userId);
};

export const getOrderService = async (id: number | undefined, userId: number, role: string) => {
  if (!id) {
    throw new CustomError("Please include the id of the order", 400, HttpMessages.FAIL);
  }

  const order = await getOrderByID(id);
  if (!order) {
    throw new CustomError("Order with this ID doesn't exist", 404, HttpMessages.FAIL);
  }

  if (role !== "admin" && order.userId !== userId) {
    throw new CustomError("Forbidden", 403, HttpMessages.FAIL);
  }

  return order;
};

export const deleteOrderService = async (id: number | undefined, userId: number, role: string) => {
  if (!id) {
    throw new CustomError("Please include the id of the order", 400, HttpMessages.FAIL);
  }

  const order = await getOrderByID(id);
  if (!order) {
    throw new CustomError("Order with this ID doesn't exist", 404, HttpMessages.FAIL);
  }

  if (role !== "admin" && order.userId !== userId) {
    throw new CustomError("Forbidden", 403, HttpMessages.FAIL);
  }

  return deleteOrderAndRestoreStock(id, order.bookId, order.quantity);
};
