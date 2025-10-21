const { PrismaClient } = require("@prisma/client");
import { PublisherData } from "../types/publisherData";
const prisma = new PrismaClient();

export const createPublisher = async (data: PublisherData) => {
  return await prisma.publishers.create({ data });
};

export const deletePublisher = async (id: Number | undefined) => {
  return await prisma.publishers.delete({
    where: { id },
  });
};

export const getPublisherByID = async (id: Number | undefined) => {
  return await prisma.publishers.findUnique({
    where: { id },
  });
};

export const getPublisherByEmail = async (email: string) => {
  return await prisma.publishers.findUnique({
    where: { email },
  });
};

export const getAllPublishers = async () => {
  return await prisma.publishers.findMany();
};

export const updatePublisher = async (
  id: string | undefined,
  data: PublisherData
) => {
  return await prisma.publishers.update({
    where: { id },
    data,
  });
};
