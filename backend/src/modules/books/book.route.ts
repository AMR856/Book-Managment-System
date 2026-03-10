// CRUD
import express from "express";
import bookSchema from "./book.validations";

import {
  getBook,
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
} from "./book.controller";
import { validate } from "../../middlewares/validate";
import { authenticate, authorizeRole } from "../auth/auth.middleware";

const router = express.Router();

router.get("/:id", getBook);
router.get("/", getAllBooks);
router.post("/", authenticate, authorizeRole("admin"), validate(bookSchema), createBook);
router.put("/:id", authenticate, authorizeRole("admin"), validate(bookSchema), updateBook);
router.delete("/:id", authenticate, authorizeRole("admin"), deleteBook);

export default router;