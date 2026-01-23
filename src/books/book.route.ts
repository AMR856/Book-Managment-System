// CRUD
import express from "express";
import { validate } from "../middlewares/validate";
import bookSchema from "./book.validations";


import {
  getBook,
  getAllBooks,
  createBook,
  updateBook,
  deleteBook
} from './book.controller';

const router = express.Router();


router.get('/:id', getBook);
router.get('/', getAllBooks);
router.post('/', validate(bookSchema), createBook);
router.put('/:id', validate(bookSchema), updateBook);
router.delete('/:id', deleteBook);

export default router;