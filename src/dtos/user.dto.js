const Joi = require('joi');

const id = Joi.number().integer();
const email = Joi.string().email();
const password = Joi.string().min(8);
const role = Joi.string().min(5);
const firstName = Joi.string().min(2).max(50);
const lastName = Joi.string().min(2).max(50);
const phone =  Joi.string();

const createUserDto = Joi.object({
  email: email.required(),
  password: password.required(),
  firstName: firstName.required(),
  lastName: lastName.required(),
});

const updateUserDto = Joi.object({
  email: email,
  role: role,
  firstName,
  lastName,
  phone,
});

const getUserDto = Joi.object({
  id: id.required(),
});

module.exports = { createUserDto, updateUserDto, getUserDto }
