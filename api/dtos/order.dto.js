const Joi = require('joi');

const id = Joi.number().integer();
const userId = Joi.number().integer();
const productId = Joi.number().integer();
const amount = Joi.number().integer().min(1);
const orderTotal = Joi.number().min(1);
const productPrice = Joi.number();
const referenceBankCode = Joi.number().integer();

const item = {
  productId: productId.required(),
  amount: amount.required(),
  productPrice: productPrice.required(),
};

const products = Joi.array().items(Joi.object(item)).min(1);

const getOrderDto = Joi.object({
  id: id.required(),
});

const createOrderDto = Joi.object({
  userId: userId.required(),
  orderTotal: orderTotal.required(),
  referenceBankCode: referenceBankCode.required(),
  products: products.required(),
});

module.exports = { getOrderDto, createOrderDto };
