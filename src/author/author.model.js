const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createAuthor = async (data) => {
  return prisma.authors.create({ data });
};

const deleteAuthor = async (id) => {
  return prisma.authors.delete({
    where: { id },
  });
};

const getAuthor = async (id) => {
  return prisma.authors.findUnique({
    where: { id },
  });
};

const getAllAuthors = async() => {
  return prisma.authors.findMany();
};

const updateAuthor = async(id, data) => {
  return prisma.author.update({
    where: { id },
    data
  });
};


module.exports = {
  createAuthor,
  deleteAuthor,
  updateAuthor,
  getAuthor,
  getAllAuthors
};
