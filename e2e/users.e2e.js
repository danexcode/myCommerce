const request = require('supertest');
const createApp = require("../api/app");
const { models } = require("../api/db/sequelize");
const { upSeed, downSeed } = require('./utils/umzug');

describe('test for /users path', () => {
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

  describe('GET /users', () => {
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

    test('should return a list of users ( admin token )', async () => {
      const { statusCode, body } = await api
        .get(`/api/v1/users`)
        .set({ 'Authorization': `Bearer ${adminToken}` });
      expect(statusCode).toEqual(200);
      expect(body).toBeInstanceOf(Array);
    });

    test('should return 401 without token', async () => {
      const { statusCode } = await api
        .get(`/api/v1/users/1`);
      expect(statusCode).toEqual(401);
    });

    test('should return 401 ( customer token )', async () => {
      const { statusCode, body } = await api
        .get(`/api/v1/users`)
        .set({ 'Authorization': `Bearer ${customerToken}` });
      expect(statusCode).toEqual(401);
      expect(body.message).toEqual('your role is not allow');
    });

    afterAll(() => {
      adminToken = null;
      customerToken = null;
    });
  });

  describe('GET /users/:id', () => {
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

    test('should return a user', async () => {
      // Arrange
      const user = await models.User.findByPk('1');
      // Act
      const { statusCode, body } = await api
        .get(`/api/v1/users/${user.id}`)
        .set({ 'Authorization': `Bearer ${adminToken}` });
      // Assert
      expect(statusCode).toEqual(200);
      expect(body.id).toEqual(user.id);
      expect(body.email).toEqual(user.email);
    });

    test('should return 401 without token', async () => {
      const { statusCode } = await api
        .get(`/api/v1/users/1`);
      expect(statusCode).toEqual(401);
    });

    test('should return 404 user doesnt exits', async () => {
      const { statusCode } = await api
        .get(`/api/v1/users/100000000`)
        .set({ 'Authorization': `Bearer ${adminToken}` });
      expect(statusCode).toEqual(404);
    });

    afterAll(() => {
      adminToken = null;
    });
  });

  describe('POST /users', () => {
    test('should return 400 with invalid data', async () => {
      // Arrage
      const inputData = {
        email: "danifanton@gmail.com",
        password: "---",
      };
      // Act
      const { statusCode, body } = await api
        .post('/api/v1/users')
        .send(inputData);
      // Assert
      expect(statusCode).toEqual(400);
      expect(body.message).toMatch(/password/);
    });

    test('should return new user', async () => {
      // Arrage
      const inputData = {
        email: "daniel@gmail.com",
        password: "root1234",
        firstName: 'Victor',
        lastName: 'Ramirez',
      };
      // Act
      const { statusCode, body } = await api
        .post('/api/v1/users')
        .send(inputData);
      // Assert
      expect(statusCode).toEqual(201);
      // Check DB
      const user = await models.User.findByPk(body.id);
      expect(user).toBeTruthy();
      expect(user.role).toEqual('customer');
      expect(user.email).toEqual(inputData.email);
    });

    test('should return 409 with no unique email', async () => {
      // Arrage
      const inputData = {
        email: "daniel@gmail.com",
        password: "root1234",
        firstName: 'Victor',
        lastName: 'Ramirez',
      };
      // Act
      const { statusCode, body } = await api
        .post('/api/v1/users')
        .send(inputData);
      // Assert
      expect(statusCode).toEqual(409);
      expect(body.message).toMatch(/Unique/);
    });
  });

  describe('PATCH /users/:id', () => {
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

    test('should return 400 with invalid data', async () => {
      const inputData = {
        favoriteSoundTrack: "Shape of you",
      };
      const { statusCode } = await api
        .patch('/api/v1/users/1')
        .set({ 'Authorization': `Bearer ${adminToken}` })
        .send(inputData);
      expect(statusCode).toEqual(400);
    });

    test('should return 200 updated user', async () => {
      const inputData = {
        phone: "+456987123",
      };
      const { statusCode, body } = await api
        .patch('/api/v1/users/1')
        .set({ 'Authorization': `Bearer ${adminToken}` })
        .send(inputData);
      expect(statusCode).toEqual(200);

      const user = await models.User.findByPk(body.id);
      expect(user).toBeTruthy();
      expect(user.phone).toEqual(inputData.phone);
    });

    test('should return 404 user doesnt exits', async () => {
      const inputData = {
        phone: "+456987123",
      };
      const { statusCode } = await api
        .patch(`/api/v1/users/100000000`)
        .set({ 'Authorization': `Bearer ${adminToken}` })
        .send(inputData);
      expect(statusCode).toEqual(404);
    });

    test('should return 401 invalid token', async () => {
      const inputData = {
        phone: "+456987123",
      };
      const { statusCode } = await api
        .patch(`/api/v1/users/1`)
        .set({ 'Authorization': `Bearer ${customerToken}` })
        .send(inputData);
      expect(statusCode).toEqual(401);
    });

    test('should return 401 with no token', async () => {
      const inputData = {
        phone: "+456987123",
      };
      const { statusCode } = await api
        .patch(`/api/v1/users/1`)
        .send(inputData);
      expect(statusCode).toEqual(401);
    });

    afterAll(() => {
      adminToken = null;
      customerToken = null;
    });
  });

  describe('DELETE /users/:id', () => {
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

    test('should return 404 user not found', async () => {
      const { statusCode } = await api
        .delete(`/api/v1/users/100000000`)
        .set({ 'Authorization': `Bearer ${adminToken}` });
      expect(statusCode).toEqual(404);
    });

    test('should return 401 invalid token', async () => {
      const { statusCode } = await api
        .delete(`/api/v1/users/1`)
        .set({ 'Authorization': `Bearer ${customerToken}` });
      expect(statusCode).toEqual(401);
    });

    test('should return 401 with no token', async () => {
      const { statusCode } = await api
        .delete(`/api/v1/users/1`);
      expect(statusCode).toEqual(401);
    });

    test('should return 200 user deleted', async () => {
      const { statusCode, body } = await api
        .delete('/api/v1/users/3')
        .set({ 'Authorization': `Bearer ${adminToken}` });
      expect(statusCode).toEqual(200);

      const user = await models.User.findByPk(body.id);
      expect(user).toBeFalsy();
    });

    test('should return 500 user has orders', async () => {
      const { statusCode } = await api
        .delete('/api/v1/users/2')
        .set({ 'Authorization': `Bearer ${adminToken}` });
      expect(statusCode).toEqual(500);
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
