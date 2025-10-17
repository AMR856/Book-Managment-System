const authorService = require("./author.service.js");
const { SUCCESS, ERROR, FAIL } = require("../utils/statusMessages.js");

const createAuthor = async (req, res, next) => {
  try {
    const newAuthor = await authorService.createAuthorService(req.body);
    res.status(201).json({
      status: SUCCESS,
      data: newAuthor,
    });
  } catch (err) {
    next(err);
  }
};

const getAllAuthors = async (req, res, next) => {
  try {
    const authors = await authorService.getAllBooksService();
    res.status(200).json({
      status: SUCCESS,
      data: authors,
    });
  } catch (err) {
    next(err);
  }
};

const getAuthor = async (req, res, next) => {
  try {
    const author = await authorService.getBookService({
      id: Number(req.params.id),
    });
    res.status(200).json({
      status: SUCCESS,
      data: author,
    });
  } catch (err) {
    next(err);
  }
};

const updateAuthor = async (req, res, next) => {
  try {
    const updated = await authorService.updateAuthorService({
      id: Number(req.params.id),
      ...req.body,
    });
    res.status(200).json({
      status: "success",
      message: "Author updated successfully",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

const deleteAuthor = async (req, res, next) => {
  try {
    await authorService.deleteAuthorService({ id: Number(req.params.id) });
    res.status(200).json({
      status: SUCCESS,
      message: "Author deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createAuthor,
  getAllAuthors,
  getAuthor,
  updateAuthor,
  deleteAuthor,
};
