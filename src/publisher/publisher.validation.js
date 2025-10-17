const Joi = require('joi');

const authorSchema = Joi.object({
  name: Joi.string().min(2).required(),
  address: Joi.string().optional().allow(''),
  phone: Joi.string().optional().allow(''),
  website: Joi.string().email().optional().allow(''),
  email: Joi.string().email().optional().allow(''),
  createdAt: Joi.forbidden(),
  updatedAt: Joi.forbidden(),
});

module.exports = authorSchema;
