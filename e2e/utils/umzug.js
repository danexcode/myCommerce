const sequelize = require('../../api/db/sequelize');
const { Umzug, SequelizeStorage } = require("umzug");

const umzug = new Umzug({
  migrations: {glob: './api/db/seeders/*.js'},
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: undefined,
});

async function upSeed() {
  try {
    await sequelize.sync({ force: true });
    await umzug.up();
  } catch (error) {
    console.error(error);
  }
}

async function downSeed() {
  await sequelize.drop();
}

module.exports = {
  upSeed,
  downSeed,
};
