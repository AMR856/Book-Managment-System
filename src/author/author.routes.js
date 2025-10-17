// CRUD
const express = require("express");
const router = express.Router();
const validate = require('../middlewares/validate');
const authorSchema = require('./author.validation');

const {
  createAuthor,
  getAllAuthors,
  getAuthor,
  updateAuthor,
  deleteAuthor,
} = require('./author.controller');


router.get('/:id', getAuthor);
router.get('/', getAllAuthors);
router.post('/', validate(authorSchema), createAuthor);
router.put('/:id', validate(authorSchema), updateAuthor);
router.delete('/:id', deleteAuthor);

module.exports = router;
