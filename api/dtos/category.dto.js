const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(3).max(50);
const description = Joi.string().min(3);
const image = Joi.string().uri();

const createCategoryDto = Joi.object({
  name: name.required(),
  description: description.required(),
  image: image.required(),
});

const updateCategoryDto = Joi.object({
  name,
  image,
  description,
});

const getCategoryDto = Joi.object({
  name: name.required()
});

const getCategoryNameDto = Joi.object({
  name: name.required(),
});

module.exports = { createCategoryDto, updateCategoryDto, getCategoryDto, getCategoryNameDto }
