const authorModel = require('./author.model.js');
const CustomError = require('../utils/customError.js');

const createAuthorService = async (data) => {
  const isExist = await authorModel.getAuthor(data.id);
  if (isExist) {
    throw new CustomError('An author with this ID already exist', 409);
  }
  return authorModel.createAuthor(data);
}

const getAllBooksService = async () => {
  return authorModel.getAllAuthors();
}

const getBookService = async(data) => {
  const author = await authorModel.getAuthor(data.id);
  if (!author){
    throw new CustomError("Author with this ID doesn't exist", 404);
  }
  return author;
}

const deleteAuthorService = async (data) => {
  try {
    await authorModel.deleteAuthor(data.id);
  } catch(error) {
    if (error.code === 'P2025') {
      throw CustomError('Author not found', 400);
    }
  }
  return true;
}

const updateAuthorService = async(id, data) => {
  try {
    const { createdAt, updatedAt, ...safeData } = data;
    await authorModel.updateAuthor(id, safeData);
  } catch(error) {
    if (error.code === 'P2025') {
      throw CustomError('Author not found', 400);
    }
  }
  return true;
}

module.exports = {
  createAuthorService,
  getAllBooksService,
  getBookService,
  updateAuthorService,
  deleteAuthorService
};