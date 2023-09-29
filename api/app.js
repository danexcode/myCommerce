const express = require('express');
const pool = require('pg');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const { SwaggerUIBundle, SwaggerUIStandalonePreset } = require('swagger-ui-dist');

const routerApi = require('./routes');
const { errorHandler, boomErrorHandler, ormErrorHandler } = require('./middlewares/error.handler');
const setupAuthStrategies = require('./auth');
const swaggerDoc = require('../swagger.json');
const CSS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css';

const options = {
  customCssUrl: CSS_URL,
};

function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cors());

  setupAuthStrategies();

  app.get('/', swaggerUi.serveFiles(swaggerDoc, options), swaggerUi.setup(swaggerDoc, options));

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
