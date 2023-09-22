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
  id: Joi.when('name', {
    is: Joi.not().exist(),
    then: id.required(),
    then: name.not().exist(),
  }),
  name: Joi.when('id', {
    is: Joi.not().exist(),
    then: name.required(),
    then: id.not().exist(),
  })
});

const getCategoryNameDto = Joi.object({
  name: name.required(),
});

module.exports = { createCategoryDto, updateCategoryDto, getCategoryDto, getCategoryNameDto }
