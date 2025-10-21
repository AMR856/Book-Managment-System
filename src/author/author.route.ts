// CRUD
import express from "express";
import { validate } from "../middlewares/validate";
import authorSchema from "./author.validations";
const router = express.Router();

import {
  getAuthor,
  getAllAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor
} from './author.controller';

router.get('/:id', getAuthor);
router.get('/', getAllAuthors);
router.post('/', validate(authorSchema), createAuthor);
router.put('/:id', validate(authorSchema), updateAuthor);
router.delete('/:id', deleteAuthor);

export default router;