const { ORDER_TABLE } = require('../models/order.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkInsert(ORDER_TABLE, [
      {
        user_id: 1,
        total: 100,
        bank_code: 789456,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 2,
        total: 190,
        bank_code: 789457,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  down: (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkDelete(ORDER_TABLE, null, {});
  },
};
