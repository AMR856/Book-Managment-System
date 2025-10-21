import Joi from "joi";

const authorSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  birthDate: Joi.date().optional(),
  nationality: Joi.string().optional().allow(""),
  biography: Joi.string().optional().allow(""),
  createdAt: Joi.forbidden(),
  updatedAt: Joi.forbidden(),
});

export default authorSchema;