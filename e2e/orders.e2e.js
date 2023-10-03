const request = require('supertest');

const createApp = require('../api/app');
const { models } = require('../api/db/sequelize');
const { upSeed, downSeed } = require('./utils/umzug');

describe('Tests for /orders path', () => {
  let app = null;
  let server = null;
  let api = null;
  let adminToken = null;
  let customerToken = null;

  beforeAll(async () => {
    app = createApp();
    server = app.listen(9000);
    api = request(app);
    await upSeed();
  });

  describe('POST /orders', () => {
    beforeAll(async () => {
      const adminUser = await models.User.findByPk('1');
      const adminInputData = {
        email: adminUser.email,
        password: 'admin123',
      };
      const { body: adminBody } = await api
        .post('/api/v1/auth/login')
        .send(adminInputData);
      adminToken = adminBody.access_token;

      const customerUser = await models.User.findByPk('2');
      const customerInputData = {
        email: customerUser.email,
        password: 'customer123',
      };
      const { body: customerBody } = await api
        .post('/api/v1/auth/login')
        .send(customerInputData);
      customerToken = customerBody.access_token;
    });

    test('should return 401 without token', async () => {
      const inputData = {
        userId: 1,
        orderTotal: 60,
        referenceBankCode: 957844,
        products: [
          {
            productId: 3,
            amount: 2,
            productPrice: 30
          }
        ]
      };
      const { statusCode } = await api
        .post(`/api/v1/orders`)
        .send(inputData);
      expect(statusCode).toEqual(401);
    });

    test('should return 400 with bad body request ( admin token )', async () => {
      const inputData = {
        name: 'newProduct',
        images: 'https://hola.com/image/123',
      };
      const { statusCode } = await api
        .post(`/api/v1/orders`)
        .set({ 'Authorization': `Bearer ${adminToken}` })
        .send(inputData);
      expect(statusCode).toEqual(400);
    });

    test('should return a New order with ( admin token )', async () => {
      const inputData = {
        userId: 1,
        orderTotal: 60,
        referenceBankCode: 957844,
        products: [
          {
            productId: 3,
            amount: 2,
            productPrice: 30
          }
        ]
      };
      const { statusCode, body } = await api
        .post(`/api/v1/orders`)
        .set({ 'Authorization': `Bearer ${adminToken}` })
        .send(inputData);
      expect(statusCode).toEqual(201);

      const order = await models.Order.findByPk(body.newOrder.id);
      expect(order.total).toEqual(inputData.orderTotal);
      expect(body.orderProducts.length).toEqual(inputData.products.length);
    });

    test('should return 404 user not found', async () => {
      const inputData = {
        userId: 150,
        orderTotal: 60,
        referenceBankCode: 957844,
        products: [
          {
            productId: 3,
            amount: 2,
            productPrice: 30
          }
        ]
      };
      const { statusCode } = await api
        .post(`/api/v1/orders`)
        .set({ 'Authorization': `Bearer ${adminToken}` })
        .send(inputData);
      expect(statusCode).toEqual(404);
    });

    test('should return 500 with bad data in products', async () => {
      const inputData = {
        userId: 1,
        orderTotal: 60,
        referenceBankCode: 957844,
        products: [
          {
            productId: 350,
            amount: 2,
            productPrice: 30
          }
        ]
      };
      const { statusCode } = await api
        .post(`/api/v1/orders`)
        .set({ 'Authorization': `Bearer ${adminToken}` })
        .send(inputData);
      expect(statusCode).toEqual(500);
    });

    afterAll(() => {
      adminToken = null;
      customerToken = null;
    });
  });

  describe('GET /orders/:id', () => {
    beforeAll( async () => {
      const user = await models.User.findByPk('1');
      const inputData = {
        email: user.email,
        password: 'admin123',
      };
      const { body: bodyLogin } = await api
        .post('/api/v1/auth/login')
        .send(inputData);
      adminToken = bodyLogin.access_token;
    });

    test('should return an order', async () => {
      // Arrange
      const order = await models.Order.findByPk('1');
      // Act
      const { statusCode, body } = await api
        .get(`/api/v1/orders/${order.id}`)
        .set({ 'Authorization': `Bearer ${adminToken}` });
      // Assert
      expect(statusCode).toEqual(200);
      expect(body.id).toEqual(order.id);
    });

    test('should return 401 without token', async () => {
      const { statusCode } = await api
        .get(`/api/v1/orders/1`);
      expect(statusCode).toEqual(401);
    });

    test('should return 404 order not found', async () => {
      const { statusCode } = await api
        .get(`/api/v1/orders/100000000`)
        .set({ 'Authorization': `Bearer ${adminToken}` });
      expect(statusCode).toEqual(404);
    });

    afterAll(() => {
      adminToken = null;
    });
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});

