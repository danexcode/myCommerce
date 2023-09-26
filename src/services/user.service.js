const boom = require('@hapi/boom');
const bcrypt = require('bcryptjs');

const { models } = require('../db/sequelize');

class UserService {
  async create(data) {
    const hash = await bcrypt.hash(data.password, 10);
    const newUser = await models.User.create({
      ...data,
      password: hash,
    });
    delete newUser.dataValues.password;
    return newUser;
  }

  async find() {
    const users = await models.User.findAll();
    users.forEach((user) => {
      delete user.dataValues.password;
    });
    return users;
  }

  async findByEmail(email) {
    const user = await models.User.findOne({
      where: { email }
    });
    delete user.dataValues.password;
    return user;
  }

  async findOne(id) {
    const user = await models.User.findByPk(id);
    if (!user) {
      throw boom.notFound('user not found');
    }
    delete user.dataValues.password;
    return user;
  }

  async update(id, changes) {
    const user = await this.findOne(id);
    changes.updatedAt = Date.now();
    const updatedUser = await user.update(changes);
    delete updatedUser.dataValues.password;
    return updatedUser;
  }

  async delete(id) {
    const user = await this.findOne(id);
    await user.destroy();
    return { id };
  }
}

module.exports = UserService;
