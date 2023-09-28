const express = require('express');
const passport = require('passport');

const OrderService = require('../services/order.service');
const validateDataHandler = require('../middlewares/validator.handler');
const { checkRoles } = require('../middlewares/auth.handler');
const { getOrderDto, createOrderDto } = require('../dtos/order.dto');
const { checkSum } = require('../middlewares/math.handler');

const router = express.Router();
const service = new OrderService();

router.get('/:id',
  passport.authenticate('jwt', {session: false}),
  validateDataHandler(getOrderDto, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const order = await service.findOne(id);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  passport.authenticate('jwt', {session: false}),
  validateDataHandler(createOrderDto, 'body'),
  checkSum,
  async (req, res, next) => {
    try {
      const body = req.body;
      const newOrder = await service.create(body);
      body.orderId = newOrder.id;
      const orderProducts = await service.addItems(body);
      res.status(201).json({ newOrder, orderProducts });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
