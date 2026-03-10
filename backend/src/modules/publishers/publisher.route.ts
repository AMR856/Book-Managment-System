// CRUD
import express from "express";
import publisherSchema from "./publisher.validations";
const router = express.Router();

import {
  getPublisher,
  getAllPublishers,
  deletePublisher,
  createPublisher,
  updatePublisher,
} from "./publisher.controller";
import { validate } from "../../middlewares/validate";
import { authenticate, authorizeRole } from "../auth/auth.middleware";

router.get("/:id", getPublisher);
router.get("/", getAllPublishers);
router.post("/", authenticate, authorizeRole("admin"), validate(publisherSchema), createPublisher);
router.put("/:id", authenticate, authorizeRole("admin"), validate(publisherSchema), updatePublisher);
router.delete("/:id", authenticate, authorizeRole("admin"), deletePublisher);

export default router;
