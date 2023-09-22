const express = require('express');
const cors = require('cors');
const routerApi = require('./routes');

function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.get('/', (req, res) => {
    res.send('Hola mi server en express');
  });

  // app.get('/nueva-ruta', checkApiKey, (req, res) => {
  //   res.send('Hola, soy una nueva ruta');
  // });

  routerApi(app);

  return app;
}

module.exports = createApp;
