const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createPublisher = async (data) => {
  return await prisma.publishers.create({ data });
};

const deletePublisher = async (id) => {
  return await prisma.publishers.delete({
    where: { id },
  });
};

const getPublisherByID = async (id) => {
  return await prisma.publishers.findUnique({
    where: { id },
  });
};

const getPublisherByEmail = async(email) => {
  return await prisma.publishers.findUnique({
    where: { email },
  });
}

const getAllPublishers = async () => {
  return await prisma.publishers.findMany();
};

const updatePublisher = async (id, data) => {
  return await prisma.publishers.update({
    where: { id },
    data
  });
};


module.exports = {
  createPublisher,
  deletePublisher,
  getPublisherByID,
  getPublisherByEmail,
  getAllPublishers,
  updatePublisher
};
