// CRUD
import express from "express";
import { validate } from "../middlewares/validate";
import publisherSchema from "./publisher.validations";
const router = express.Router();

import {
  getPublisher,
  getAllPublishers,
  deletePublisher,
  createPublisher,
  updatePublisher
} from './publisher.controller';

router.get('/:id', getPublisher);
router.get('/', getAllPublishers);
router.post('/', validate(publisherSchema), createPublisher);
router.put('/:id', validate(publisherSchema), updatePublisher);
router.delete('/:id', deletePublisher);

export default router;