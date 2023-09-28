const { config } = require('../config/config');

module.exports = {
  development: {
    url: config.dbUrl,
    dialect: 'postgres',
  },
  production: {
    url: config.dbProdUrl,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  }
}
