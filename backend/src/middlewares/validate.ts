import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import CustomError from "../types/customError";
import HttpMessages from "../types/statusMessages";

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const messages = error.details.map(d => d.message).join(", ");
      const joiError = new CustomError(messages, 400, HttpMessages.FAIL);
      joiError.isJoi = true;
      throw joiError;
    }

    next();
  };
};
