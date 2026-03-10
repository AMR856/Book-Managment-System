// CRUD for orders
import express from "express";
import orderSchema from "./order.validations";

import {
  createOrder,
  getOrders,
  getOrder,
  deleteOrder,
} from "./order.controller";
import { validate } from "../../middlewares/validate";
import { authenticate } from "../auth/auth.middleware";

const router = express.Router();

router.get("/:id", authenticate, getOrder);
router.get("/", authenticate, getOrders);
router.post("/", authenticate, validate(orderSchema), createOrder);
router.delete("/:id", authenticate, deleteOrder);

export default router;
