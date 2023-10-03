const request = require('supertest');

const createApp = require('../api/app');
const { models } = require('../api/db/sequelize');
const { upSeed, downSeed } = require('./utils/umzug');

describe('Tests for /categories path', () => {
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

  describe('POST /categories', () => {
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
        name: 'newCategory',
        image: 'https://hola.com/image/123',
      };
      const { statusCode } = await api
        .post(`/api/v1/categories`)
        .send(inputData);
      expect(statusCode).toEqual(401);
    });

    test('should return 400 with bad body request ( admin token )', async () => {
      const inputData = {
        name: 'newCategory',
        images: 'https://hola.com/image/123',
      };
      const { statusCode } = await api
        .post(`/api/v1/categories`)
        .set({ 'Authorization': `Bearer ${adminToken}` })
        .send(inputData);
      expect(statusCode).toEqual(400);
    });

    test('should return a New category with ( admin token )', async () => {
      const inputData = {
        name: 'newCategory',
        image: 'https://hola.com/image/123',
        description: 'A description',
      };
      const { statusCode, body } = await api
        .post(`/api/v1/categories`)
        .set({ 'Authorization': `Bearer ${adminToken}` })
        .send(inputData);
      expect(statusCode).toEqual(201);

      const category = await models.Category.findByPk(body.id);
      expect(category.name).toEqual(inputData.name);
      expect(category.image).toEqual(inputData.image);
    });

    test('should return 409 with no unique data ( admin token )', async () => {
      const inputData = {
        name: 'newCategory',
        image: 'https://hola.com/image/123',
        description: 'A description',
      };

      const { statusCode } = await api
        .post(`/api/v1/categories`)
        .set({ 'Authorization': `Bearer ${adminToken}` })
        .send(inputData);
      expect(statusCode).toEqual(409);
    });

    test('should return 401 ( customer token )', async () => {
      const inputData = {
        name: 'newCategory',
        image: 'https://hola.com/image/123',
      };
      const { statusCode } = await api
        .post(`/api/v1/categories`)
        .set({ 'Authorization': `Bearer ${customerToken}` })
        .send(inputData);
      expect(statusCode).toEqual(401);
    });

    afterAll(() => {
      adminToken = null;
      customerToken = null;
    });
  });

  describe('GET /categories', () => {
    test('should return a list of categories', async () => {
      const { statusCode, body } = await api
        .get(`/api/v1/categories`);
      expect(statusCode).toEqual(200);
      expect(body).toBeInstanceOf(Array);
    });
  });

  describe('GET /categories/:name', () => {
    test('should return a category', async () => {
      // Arrange
      const category = await models.Category.findByPk('1');
      // Act
      const { statusCode, body } = await api
        .get(`/api/v1/categories/${category.name}`);
      // Assert
      expect(statusCode).toEqual(200);
      expect(body.id).toEqual(category.id);
    });

    test('should return 404 category not found', async () => {
      const { statusCode } = await api
        .get(`/api/v1/categories/Sayayin`);
      expect(statusCode).toEqual(404);
    });
  });

  describe('PATCH /categories/:name', () => {
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
        myFavoriteName: "Emilia",
      };
      const { statusCode } = await api
        .patch('/api/v1/categories/Category1')
        .set({ 'Authorization': `Bearer ${adminToken}` })
        .send(inputData);
      expect(statusCode).toEqual(400);
    });

    test('should return 200 category updated', async () => {
      const inputData = {
        description: "New description",
      };
      const { statusCode, body } = await api
        .patch('/api/v1/categories/Category1')
        .set({ 'Authorization': `Bearer ${adminToken}` })
        .send(inputData);
      expect(statusCode).toEqual(200);

      const category = await models.Category.findByPk(body.id);
      expect(category).toBeTruthy();
      expect(category.description).toEqual(inputData.description);
    });

    test('should return 404 category not found', async () => {
      const inputData = {
        description: "New description",
      };
      const { statusCode } = await api
        .patch(`/api/v1/categories/falsyCategory`)
        .set({ 'Authorization': `Bearer ${adminToken}` })
        .send(inputData);
      expect(statusCode).toEqual(404);
    });

    test('should return 401 invalid token ( customer token )', async () => {
      const inputData = {
        description: "New description",
      };
      const { statusCode } = await api
        .patch(`/api/v1/categories/Category1`)
        .set({ 'Authorization': `Bearer ${customerToken}` })
        .send(inputData);
      expect(statusCode).toEqual(401);
    });

    test('should return 401 with no token', async () => {
      const inputData = {
        description: "New description",
      };
      const { statusCode } = await api
        .patch(`/api/v1/categories/Category1`)
        .send(inputData);
      expect(statusCode).toEqual(401);
    });

    test('should return 409 with no unique name', async () => {
      // Arrage
      const inputData = {
        name: "Category2",
      };
      // Act
      const { statusCode, body } = await api
        .patch('/api/v1/categories/Category1')
        .set({ 'Authorization': `Bearer ${adminToken}` })
        .send(inputData);
      // Assert
      expect(statusCode).toEqual(409);
      expect(body.message).toMatch(/Unique/);
    });

    afterAll(() => {
      adminToken = null;
      customerToken = null;
    });
  });

  describe('DELETE /categories/:name', () => {
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

    test('should return 404 category not found', async () => {
      const { statusCode } = await api
        .delete(`/api/v1/categories/falsyCategory`)
        .set({ 'Authorization': `Bearer ${adminToken}` });
      expect(statusCode).toEqual(404);
    });

    test('should return 401 invalid token ( customer token )', async () => {
      const { statusCode } = await api
        .delete(`/api/v1/categories/Category1`)
        .set({ 'Authorization': `Bearer ${customerToken}` });
      expect(statusCode).toEqual(401);
    });

    test('should return 401 with no token', async () => {
      const { statusCode } = await api
        .delete(`/api/v1/categories/Category1`);
      expect(statusCode).toEqual(401);
    });

    test('should return 200 category deleted', async () => {
      const { statusCode, body } = await api
        .delete('/api/v1/categories/newCategory')
        .set({ 'Authorization': `Bearer ${adminToken}` });
      expect(statusCode).toEqual(200);

      const category = await models.Category.findByPk(body.id);
      expect(category).toBeFalsy();
    });

    test('should return 500 category has products', async () => {
      const { statusCode } = await api
        .delete('/api/v1/categories/Category1')
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
