const { Pool } = require('pg');
const { config } = require("../../config/config");

let URI = "";

if(config.isProd){
  URI = config.dbProdUrl;
} else {
  URI = config.dbUrl;
}

const pool = new Pool({ connectionString: URI });

module.exports = pool;
