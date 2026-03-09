import express from "express";
import authorSchema from "./author.validations";
const router = express.Router();

import {
  getAuthor,
  getAllAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "./author.controller";
import { validate } from "../../middlewares/validate";
import { authenticate, authorizeRole } from "../auth/auth.middleware";

router.get("/:id", getAuthor);
router.get("/", getAllAuthors);
router.post("/", authenticate, authorizeRole("admin"), validate(authorSchema), createAuthor);
router.put("/:id", authenticate, authorizeRole("admin"), validate(authorSchema), updateAuthor);
router.delete("/:id", authenticate, authorizeRole("admin"), deleteAuthor);

export default router;
