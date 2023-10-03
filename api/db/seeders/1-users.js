const bcrypt = require('bcryptjs');
const { USER_TABLE } = require('../models/user.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkInsert(USER_TABLE, [
      {
        email: 'admin@gmail.com',
        password: await bcrypt.hash('admin123', 10),
        first_name: 'Daniel',
        last_name: 'Rodriguez',
        role: 'admin',
        phone: '+789456897',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'customer@gmail.com',
        password: await bcrypt.hash('customer123', 10),
        first_name: 'Orlando',
        last_name: 'Rodriguez',
        role: 'customer',
        phone: '+123654987',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  down: (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkDelete(USER_TABLE, null, {});
  },
};
