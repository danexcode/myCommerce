const { CATEGORY_TABLE } = require('../models/category.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkInsert(CATEGORY_TABLE, [
      {
        name: 'Category1',
        description: 'A description',
        image: 'https://api.lorem.space/image/game',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Category2',
        description: 'A description',
        image: 'https://api.lorem.space/image/game',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  down: (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkDelete(CATEGORY_TABLE, null, {});
  },
};
