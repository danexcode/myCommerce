const request = require('supertest');

const createApp = require("../api/app");
const { models } = require("../api/db/sequelize");
const { upSeed, downSeed } = require('./utils/umzug');

describe('test for /profile path', () => {
  let app = null;
  let server = null;
  let api = null;
  let adminToken = null;
  let customerToken = null;

  beforeAll(async () => {
    app = createApp();
    server = app.listen(9000);
    api = request(app);
    await upSeed()
  });

  describe('GET /my-user admin user', () => {
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

    test('should return 401 with invalid token', async () => {
      const { statusCode } = await api
        .get('/api/v1/profile/my-user')
        .set({ 'Authorization': `Bearer 7897` });
      expect(statusCode).toBe(401);
    });

    test('should return a user with accessToken valid', async () => {
      // Arrange
      const user = await models.User.findByPk('1');
      // Act
      const { statusCode, body } = await api
        .get('/api/v1/profile/my-user')
        .set({ 'Authorization': `Bearer ${adminToken}` });
      // Assert
      expect(statusCode).toBe(200);
      expect(body.email).toEqual(user.email);
    });

    afterAll(() => {
      adminToken = null;
      customerToken = null;
    });
  });

  describe('GET /my-orders', () => {
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

    test('should return 401 with invalid token', async () => {
      const { statusCode } = await api
        .get('/api/v1/profile/my-user')
        .set({ 'Authorization': `Bearer 7897` });
      expect(statusCode).toBe(401);
    });

    test('should return 200 with a list of orders', async () => {
      const { statusCode, body } = await api
        .get('/api/v1/profile/my-orders')
        .set({ 'Authorization': `Bearer ${customerToken}` });
      expect(statusCode).toBe(200);
      expect(body[0].items).toBeTruthy();
    });

    afterAll(() => {
      adminToken = null;
      customerToken = null;
    });
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});

