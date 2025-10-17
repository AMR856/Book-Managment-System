const authorModel = require('./author.model.js');
const CustomError = require('../utils/customError.js');

const createAuthorService = async (data) => {
  const isExist = await authorModel.getAuthorByEmail(data.email);
  if (isExist) {
    throw new CustomError('An author with this email already exist', 409);
  }
  return authorModel.createAuthor(data);
}

const getAllAuthorsService = async () => {
  return authorModel.getAllAuthors();
}

const getAuthorService = async(data) => {
  const author = await authorModel.getAuthorByID(data.id);
  if (!author){
    throw new CustomError("Author with this ID doesn't exist", 404);
  }
  return author;
}

const deleteAuthorService = async (data) => {
  const author = await authorModel.getAuthorByID(data.id);
  if (!author){
    throw new CustomError("Author with this ID doesn't exist", 404);
  }
  return await authorModel.deleteAuthor(data.id);
}

const updateAuthorService = async(data) => {
  const { createdAt, updatedAt, id, ...safeData } = data;
  const authorID = await authorModel.getAuthorByID(id);
  if (!authorID){
    throw new CustomError("Author with this ID doesn't exist", 404);
  }
  const authorEmail = await authorModel.getAuthorByEmail(safeData.email);
  if (authorEmail){
    throw new CustomError("Can't have two authors with the same email", 400);
  }
  return await authorModel.updateAuthor(id, safeData);
}

module.exports = {
  createAuthorService,
  getAllAuthorsService,
  getAuthorService,
  updateAuthorService,
  deleteAuthorService
};