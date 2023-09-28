const { Sequelize } = require('sequelize');

const { config } = require('../config/config');
const setupModels = require('./models');

let URI = config.dbUrl;
const options = {
  dialect: 'postgres',
  logging: false,
}

if (config.isProd) {
  options.dialectOptions = {
    ssl: {
      rejectUnauthorized: false
    }
  };

  URI = config.dbProdUrl;
}

const sequelize = new Sequelize(URI, options);

setupModels(sequelize);

module.exports = sequelize;
