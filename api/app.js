const express = require('express');
const cors = require('cors')
const pool = require('pg');  // this is for vercel to work

const routerApi = require('./routes');
const { errorHandler, boomErrorHandler, ormErrorHandler } = require('./middlewares/error.handler');
const setupAuthStrategies = require('./auth');

const https = require('https');

function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cors());

  setupAuthStrategies();

  app.get('/', (req, res) => {
    res.send('Hola mi server en express');
  });

  app.get('/dolar', async (req, res) => {
    const handler = new https.Agent({
      rejectUnauthorized: false,
    });
    console.log(handler);
    try {
      console.log('trying');
      const info = await fetch("https://www.bcv.org.ve/", {
        method: "GET",
        headers: {
          "Content-type": "text/hmtl",
        },
        handler,
      });
      res.send(info);
    } catch (error) {
      console.log(error);
    }
  })

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
