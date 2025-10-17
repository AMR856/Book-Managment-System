const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createAuthor = async (data) => {
  return await prisma.authors.create({ data });
};

const deleteAuthor = async (id) => {
  return await prisma.authors.delete({
    where: { id },
  });
};

const getAuthorByID = async (id) => {
  return await prisma.authors.findUnique({
    where: { id },
  });
};

const getAuthorByEmail = async(email) => {
  return await prisma.authors.findUnique({
    where: { email },
  });
}

const getAllAuthors = async () => {
  return await prisma.authors.findMany();
};

const updateAuthor = async (id, data) => {
  return await prisma.authors.update({
    where: { id },
    data
  });
};


module.exports = {
  createAuthor,
  deleteAuthor,
  updateAuthor,
  getAuthorByID,
  getAuthorByEmail,
  getAllAuthors
};
