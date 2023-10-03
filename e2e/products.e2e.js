const request = require('supertest');

const createApp = require('../api/app');
const { models } = require('../api/db/sequelize');
const { upSeed, downSeed } = require('./utils/umzug');

describe('Tests for /products path', () => {
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

  describe('POST /products', () => {
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
        name: 'newProduct',
        image: 'https://hola.com/image/123',
        price: 10,
        description: 'A description',
        stock: 100,
        categoryId: 1,
      };
      const { statusCode } = await api
        .post(`/api/v1/products`)
        .send(inputData);
      expect(statusCode).toEqual(401);
    });

    test('should return 400 with bad body request ( admin token )', async () => {
      const inputData = {
        name: 'newProduct',
        images: 'https://hola.com/image/123',
      };
      const { statusCode } = await api
        .post(`/api/v1/products`)
        .set({ 'Authorization': `Bearer ${adminToken}` })
        .send(inputData);
      expect(statusCode).toEqual(400);
    });

    test('should return a New product with ( admin token )', async () => {
      const inputData = {
        name: 'newProduct',
        image: 'https://hola.com/image/123',
        price: 10,
        description: 'A description',
        stock: 100,
        categoryId: 1,
      };
      const { statusCode, body } = await api
        .post(`/api/v1/products`)
        .set({ 'Authorization': `Bearer ${adminToken}` })
        .send(inputData);
      expect(statusCode).toEqual(201);

      const product = await models.Product.findByPk(body.id);
      expect(product.name).toEqual(inputData.name);
      expect(product.image).toEqual(inputData.image);
    });

    test('should return 409 with no unique data ( admin token )', async () => {
      const inputData = {
        name: 'newProduct',
        image: 'https://hola.com/image/123',
        price: 10,
        description: 'A description',
        stock: 100,
        categoryId: 1,
      };
      const { statusCode } = await api
        .post(`/api/v1/products`)
        .set({ 'Authorization': `Bearer ${adminToken}` })
        .send(inputData);
      expect(statusCode).toEqual(409);
    });

    test('should return 401 ( customer token )', async () => {
      const inputData = {
        name: 'newProduct',
        image: 'https://hola.com/image/123',
        price: 10,
        description: 'A description',
        stock: 100,
        categoryId: 1,
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

  describe('GET /products', () => {
    test('should return a list of products', async () => {
      const { statusCode, body } = await api
        .get(`/api/v1/products`);
      expect(statusCode).toEqual(200);
      expect(body).toBeInstanceOf(Array);
    });

    test('should return 2 products with limit=2 and offset=0', async () => {
      const limit = 2;
      const offset = 0;
      const { statusCode, body } = await api
        .get(`/api/v1/products?limit=${limit}&offset=${offset}`);
      expect(statusCode).toBe(200);
      expect(body.length).toEqual(2);
    });
  });

  describe('GET /products/:id', () => {
    test('should return a product', async () => {
      // Arrange
      const product = await models.Product.findByPk('1');
      // Act
      const { statusCode, body } = await api
        .get(`/api/v1/products/${product.id}`);
      // Assert
      expect(statusCode).toEqual(200);
      expect(body.id).toEqual(product.id);
    });

    test('should return 404 product not found', async () => {
      const { statusCode } = await api
        .get(`/api/v1/products/54564`);
      expect(statusCode).toEqual(404);
    });
  });

  describe('PATCH /products/:id', () => {
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
        myFavoriteFood: "Pasticho",
      };
      const { statusCode } = await api
        .patch('/api/v1/products/1')
        .set({ 'Authorization': `Bearer ${adminToken}` })
        .send(inputData);
      expect(statusCode).toEqual(400);
    });

    test('should return 200 product updated', async () => {
      const inputData = {
        description: "New description",
      };
      const { statusCode, body } = await api
        .patch('/api/v1/products/1')
        .set({ 'Authorization': `Bearer ${adminToken}` })
        .send(inputData);
      expect(statusCode).toEqual(200);

      const product = await models.Product.findByPk(body.id);
      expect(product).toBeTruthy();
      expect(product.description).toEqual(inputData.description);
    });

    test('should return 404 product not found', async () => {
      const inputData = {
        description: "New description",
      };
      const { statusCode } = await api
        .patch(`/api/v1/products/4564231`)
        .set({ 'Authorization': `Bearer ${adminToken}` })
        .send(inputData);
      expect(statusCode).toEqual(404);
    });

    test('should return 401 invalid token ( customer token )', async () => {
      const inputData = {
        description: "New description",
      };
      const { statusCode } = await api
        .patch(`/api/v1/products/1`)
        .set({ 'Authorization': `Bearer ${customerToken}` })
        .send(inputData);
      expect(statusCode).toEqual(401);
    });

    test('should return 401 with no token', async () => {
      const inputData = {
        description: "New description",
      };
      const { statusCode } = await api
        .patch(`/api/v1/products/1`)
        .send(inputData);
      expect(statusCode).toEqual(401);
    });

    test('should return 409 with no unique name', async () => {
      // Arrage
      const inputData = {
        name: "Product 1",
      };
      // Act
      const { statusCode, body } = await api
        .patch('/api/v1/products/2')
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

  describe('DELETE /products/:id', () => {
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

    test('should return 404 product not found', async () => {
      const { statusCode } = await api
        .delete(`/api/v1/products/456987`)
        .set({ 'Authorization': `Bearer ${adminToken}` });
      expect(statusCode).toEqual(404);
    });

    test('should return 401 invalid token ( customer token )', async () => {
      const { statusCode } = await api
        .delete(`/api/v1/products/1`)
        .set({ 'Authorization': `Bearer ${customerToken}` });
      expect(statusCode).toEqual(401);
    });

    test('should return 401 with no token', async () => {
      const { statusCode } = await api
        .delete(`/api/v1/products/1`);
      expect(statusCode).toEqual(401);
    });

    test('should return 200 product deleted', async () => {
      const { statusCode, body } = await api
        .delete('/api/v1/products/5')
        .set({ 'Authorization': `Bearer ${adminToken}` });
      expect(statusCode).toEqual(200);

      const product = await models.Product.findByPk(body.id);
      expect(product).toBeFalsy();
    });

    test('should return 500 product has orders', async () => {
      const { statusCode } = await api
        .delete('/api/v1/products/1')
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

