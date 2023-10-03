const Joi = require('joi');

const email = Joi.string().email();
const token = Joi.string();
const newPassword = Joi.string().min(8);

const emailDto = Joi.object({
  email: email.required(),
});

const changePasswordDto = Joi.object({
  token: token.required(),
  newPassword: newPassword.required(),
});

module.exports = { emailDto, changePasswordDto };
