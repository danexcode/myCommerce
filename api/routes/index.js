const express = require('express');

const swaggerUi = require('swagger-ui-express');
const { SwaggerUIBundle, SwaggerUIStandalonePreset }  = require("swagger-ui-dist");

const swaggerDoc = require('../../swagger.json');

const options = {
  swaggerOptions: {
      url: "/api-docs/swagger.json",
  },
};

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
  router.use('/api-docs', swaggerUi.serveFiles(swaggerDoc, options), swaggerUi.setup(swaggerDoc, options));
  router.get("/api-docs/swagger.json", (req, res) => res.json(swaggerDoc));
}

module.exports = routerApi;

