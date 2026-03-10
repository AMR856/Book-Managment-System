import Joi from "joi";

const orderSchema = Joi.object({
  bookId: Joi.number().integer().required(),
  quantity: Joi.number().integer().min(1).required(),
  createdAt: Joi.forbidden(),
  updatedAt: Joi.forbidden(),
});

export default orderSchema;
