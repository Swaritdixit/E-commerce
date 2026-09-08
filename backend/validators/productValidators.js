const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().min(10).required(),
  price: Joi.number().positive().required(),
  category: Joi.string().hex().length(24).required(),
  stock: Joi.number().integer().min(0).required(),
});

module.exports = productSchema;
