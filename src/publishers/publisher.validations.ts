import Joi from "joi";

const publisherSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  address: Joi.string().optional(),
  phone: Joi.string().optional().allow(""),
  website: Joi.string().optional().allow(""),
  createdAt: Joi.forbidden(),
  updatedAt: Joi.forbidden(),
});

export default publisherSchema;