import Joi from "joi";

const bookSchema = Joi.object({
  title: Joi.string().min(2).required(),
  isbn: Joi.string().min(6).trim().required(),
  year: Joi.number().integer().optional(),
  genre: Joi.string().optional(),
  available: Joi.boolean().optional().default(true),
  quantity: Joi.number().integer().min(0).optional().default(0),
  authorId: Joi.number().integer().required(),
  publisherId: Joi.number().integer().required(),
  createdAt: Joi.forbidden(),
  updatedAt: Joi.forbidden(),
});

export default bookSchema;
