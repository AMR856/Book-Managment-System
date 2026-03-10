import { OrderData } from "../../types/orderData";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export const createOrder = async (data: OrderData) => {
  return prisma.orders.create({
    data: {
      userId: data.userId,
      bookId: data.bookId,
      quantity: data.quantity,
    },
    include: {
      book: true,
      user: true,
    },
  });
};

export const getOrderByID = async (id: number) => {
  return prisma.orders.findUnique({
    where: { id },
    include: {
      book: true,
      user: true,
    },
  });
};

export const getAllOrders = async () => {
  return prisma.orders.findMany({
    include: {
      book: true,
      user: true,
    },
  });
};

export const getOrdersByUserId = async (userId: number) => {
  return prisma.orders.findMany({
    where: { userId },
    include: {
      book: true,
      user: true,
    },
  });
};

export const deleteOrder = async (id: number) => {
  return prisma.orders.delete({
    where: { id },
  });
};
