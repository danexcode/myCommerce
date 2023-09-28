const express = require('express');
const swaggerUi = require("swagger-ui-express");
const path = require('path');

const swaggerPath = path.join(__dirname, '../../swagger.json');
const swaggerDoc = require(swaggerPath);

const productsRouter = require('./products.router');
const categoriesRouter = require('./categories.router');
const usersRouter = require('./users.router');
const ordersRouter = require('./orders.router');
const authRouter = require('./auth.router');
const profileRouter = require('./profile.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/products', productsRouter);
  router.use('/categories', categoriesRouter);
  router.use('/users', usersRouter);
  router.use('/orders', ordersRouter);
  router.use('/auth', authRouter);
  router.use('/profile', profileRouter);
  router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
}

module.exports = routerApi;

