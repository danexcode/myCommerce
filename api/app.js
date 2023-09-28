const express = require('express');
const pool = require('pg');
const cors = require('cors');
const routerApi = require('./routes');
const { errorHandler, boomErrorHandler, ormErrorHandler } = require('./middlewares/error.handler');
const setupAuthStrategies = require('./auth');

function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cors());

  setupAuthStrategies();

  app.get('/', (req, res) => {
    res.send('Hola mi server en express');
  });

  // app.get('/nueva-ruta', checkApiKey, (req, res) => {
  //   res.send('Hola, soy una nueva ruta');
  // });

  routerApi(app);

  app.use(ormErrorHandler);
  app.use(boomErrorHandler);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
