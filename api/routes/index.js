const express = require('express');
const swaggerUi = require('swagger-ui-express');

const productsRouter = require('./products.router');
const categoriesRouter = require('./categories.router');
const usersRouter = require('./users.router');
const ordersRouter = require('./orders.router');
const authRouter = require('./auth.router');
const profileRouter = require('./profile.router');
const swaggerDoc = require('../../swagger.json');

const CSS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css';

const options = {
  customCssUrl: CSS_URL,
};

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/products', productsRouter);
  router.use('/categories', categoriesRouter);
  router.use('/users', usersRouter);
  router.use('/orders', ordersRouter);
  router.use('/auth', authRouter);
  router.use('/profile', profileRouter);
  router.use('/api-docs', swaggerUi.serveFiles(swaggerDoc, options), swaggerUi.setup(swaggerDoc, options));
}

module.exports = routerApi;

