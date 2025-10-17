const Joi = require('joi');

const authorSchema = Joi.object({
  name: Joi.string().min(2).required(),
  birthDate: Joi.date().optional(),
  nationality: Joi.string().optional().allow(''),
  biography: Joi.string().optional().allow(''),
  email: Joi.string().email().optional().allow(''),
  createdAt: Joi.forbidden(),
  updatedAt: Joi.forbidden()
});

module.exports = authorSchema;
