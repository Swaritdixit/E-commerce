const Joi = require("joi");

const reviewSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().trim().min(3).max(1000).required(),
});

module.exports = reviewSchema;
