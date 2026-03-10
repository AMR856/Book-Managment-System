import HttpMessages from "../../types/statusMessages";
import {
  createOrderService,
  getOrdersService,
  getOrderService,
  deleteOrderService,
} from "./order.service";
import { Request, Response, NextFunction } from "express";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = res.locals.user;
    const order = await createOrderService(user.id, req.body);
    res.status(201).json({
      status: HttpMessages.SUCCESS,
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = res.locals.user;
    const orders = await getOrdersService(user.id, user.role);
    res.status(200).json({
      status: HttpMessages.SUCCESS,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = res.locals.user;
    const order = await getOrderService(Number(req.params.id), user.id, user.role);
    res.status(200).json({
      status: HttpMessages.SUCCESS,
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = res.locals.user;
    await deleteOrderService(Number(req.params.id), user.id, user.role);
    res.status(200).json({
      status: HttpMessages.SUCCESS,
      message: "Order deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
