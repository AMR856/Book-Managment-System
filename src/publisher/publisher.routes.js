// CRUD
const express = require("express");
const router = express.Router();
const validate = require('../middlewares/validate');
const publisherSchema = require('./author.validation');

// const {
//   createAuthor,
//   getAllAuthors,
//   getAuthor,
//   updateAuthor,
//   deleteAuthor,
// } = require('./author.controller');


router.get('/:id', getAuthor);
router.get('/', getAllAuthors);
router.post('/', validate(publisherSchema), createAuthor);
router.put('/:id', validate(publisherSchema), updateAuthor);
router.delete('/:id', deleteAuthor);

module.exports = router;
