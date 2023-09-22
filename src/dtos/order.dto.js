const Joi = require('joi');

const id = Joi.number().integer();
const userId = Joi.number().integer();
const orderId = Joi.number().integer();
const productId = Joi.number().integer();
const amount = Joi.number().integer().min(1);
const orderTotal = Joi.number().min(1);
const productPrice = Joi.number();

const getOrderDto = Joi.object({
  id: id.required(),
});

const createOrderDto = Joi.object({
  userId: userId.required(),
  orderTotal: orderTotal.required(),
});

const addItemDto = Joi.object({
  orderId: orderId.required(),
  productId: productId.required(),
  amount: amount.required(),
  productPrice: productPrice.required(),
});

module.exports = { getOrderDto, createOrderDto, addItemDto };
