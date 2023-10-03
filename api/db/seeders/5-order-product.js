const { ORDER_PRODUCT_TABLE } = require('../models/order-product.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkInsert(ORDER_PRODUCT_TABLE, [
      {
        order_id: 1,
        product_id: 1,
        amount: 4,
        product_price: 10,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        order_id: 1,
        product_id: 2,
        amount: 3,
        product_price: 20,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        order_id: 2,
        product_id: 3,
        amount: 5,
        product_price: 30,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        order_id: 2,
        product_id: 4,
        amount: 2,
        product_price: 40,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  down: (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkDelete(ORDER_PRODUCT_TABLE, null, {});
  },
};
