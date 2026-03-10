import { OrderData } from "../../types/orderData";
import CustomError from "../../types/customError";
import HttpMessages from "../../types/statusMessages";
import { getUserByID } from "../auth/auth.model";
import { getBookByID } from "../books/book.model";
import {
  createOrder,
  getAllOrders,
  getOrderByID,
  getOrdersByUserId,
  deleteOrder,
} from "./order.model";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

  const book = await getBookByID(data.bookId);
  if (!book) {
    throw new CustomError("Book does not exist", 404, HttpMessages.FAIL);
  }

  if (book.quantity < data.quantity) {
    throw new CustomError("Not enough quantity available for this book", 400, HttpMessages.FAIL);
  }

  const newQuantity = book.quantity - data.quantity;

  const order = await prisma.$transaction(async (tx: any) => {
    const created = await tx.orders.create({
      data: {
        userId,
        bookId: data.bookId,
        quantity: data.quantity,
      },
      include: {
        book: true,
        user: true,
      },
    });

    await tx.books.update({
      where: { id: data.bookId },
      data: {
        quantity: newQuantity,
        available: newQuantity > 0,
      },
    });

    return created;
  });

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

  return deleteOrder(id);
};
