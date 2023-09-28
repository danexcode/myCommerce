const boom = require('@hapi/boom');
const { models } = require('../db/sequelize');

//@todo: Update stock field when order is created

class OrderService {
  async create(data) {
    const user = await models.User.findByPk(data.userId);
    if (!user) {
      throw boom.notFound('user not found');
    }

    const orderBody = {
      userId: data.userId,
      total: data.orderTotal,
      referenceBankCode: data.referenceBankCode,
    };
    const newOrder = await models.Order.create(orderBody);
    return newOrder;
  }

  async addItems(data) {
    const items = [];
    const orderId = data.orderId;
    const products = data.products;
    for (let i = 0; i < products.length; i++){
      const itemBody = {
        orderId,
        ...products[i],
      };
      const newItem = await models.OrderProduct.create(itemBody);
      items.push(newItem);
    }
    return items;
  }

  async findByUser(userId) {
    const user = await models.User.findByPk(userId);
    if (!user) {
      throw boom.notFound('user not found');
    }
    const orders = await models.Order.findAll({
      where: {
        userId,
      },
      include: ['items'],
    });
    return orders;
  }

  async findOne(id) {
    const order = await models.Order.findByPk(id, {
      include: [
        'user',
        'items'
      ]
    });
    if (!order) {
      throw boom.notFound('order not found');
    }
    delete order.dataValues.user.dataValues.password;
    return order;
  }

  async update(id, changes) {
    const order = await this.findOne(id);
    changes.updatedAt = Date.now();
    const rta = await order.update(changes);
    return rta;
  }

  async delete(id) {
    const order = await this.findOne(id);
    await order.destroy();
    return { id };
  }

}

module.exports = OrderService;
