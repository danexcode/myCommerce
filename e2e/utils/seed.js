const bcrypt = require('bcryptjs');
const sequelize = require('../../api/db/sequelize');
const { models } = sequelize;

async function upSeed() {
  try {
    await sequelize.sync({ force: true });
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    await models.User.bulkCreate([
      {
        email: 'admin@gmail.com',
        password: hash,
        firstName: 'Daniel',
        lastName: 'Rodriguez',
        role: 'admin',
      },
      {
        email: 'customer@gmail.com',
        password: hash,
        firstName: 'Orlando',
        lastName: 'Rodriguez',
      }
    ]);

    await models.Category.bulkCreate([
      {
        name: 'Category 1',
        description: 'A description',
        image: 'https://api.lorem.space/image/game',
      },
      {
        name: 'Category 2',
        description: 'A description',
        image: 'https://api.lorem.space/image/game',
      },
    ]);
  } catch (error) {
    // console.error(error);
  }
}

async function downSeed() {
  await sequelize.drop();
}

module.exports = {
  upSeed,
  downSeed,
};
