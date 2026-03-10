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

export const createOrderWithStockUpdate = async (
  userId: number,
  bookId: number,
  quantity: number,
  newBookQuantity: number,
) => {
  return prisma.$transaction(async (tx: any) => {
    const created = await tx.orders.create({
      data: {
        userId,
        bookId,
        quantity,
      },
      include: {
        book: true,
        user: true,
      },
    });

    await tx.books.update({
      where: { id: bookId },
      data: {
        quantity: newBookQuantity,
        available: newBookQuantity > 0,
      },
    });

    return created;
  });
};

export const deleteOrderAndRestoreStock = async (
  orderId: number,
  bookId: number,
  quantity: number,
) => {
  return prisma.$transaction(async (tx: any) => {
    const deletedOrder = await tx.orders.delete({
      where: { id: orderId },
    });

    await tx.books.update({
      where: { id: bookId },
      data: {
        quantity: { increment: quantity },
        available: true,
      },
    });

    return deletedOrder;
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
