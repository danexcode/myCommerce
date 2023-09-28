const express = require('express');
const passport = require('passport');

const CategoryService = require('../services/category.service');
const validateDataHandler = require('../middlewares/validator.handler');
const { checkRoles } = require('../middlewares/auth.handler');
const { createCategoryDto, updateCategoryDto, getCategoryDto } = require('../dtos/category.dto');

const router = express.Router();
const service = new CategoryService();

router.get('/', async (req, res, next) => {
  try {
    const categories = await service.find();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

router.get('/:name',
  validateDataHandler(getCategoryDto, 'params'),
  async (req, res, next) => {
    try {
      const { name } = req.params;
      const category = await service.findByName(name);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  passport.authenticate('jwt', {session: false}),
  checkRoles('admin'),
  validateDataHandler(createCategoryDto, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newCategory = await service.create(body);
      res.status(201).json(newCategory);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:name',
  passport.authenticate('jwt', {session: false}),
  checkRoles('admin'),
  validateDataHandler(getCategoryDto, 'params'),
  validateDataHandler(updateCategoryDto, 'body'),
  async (req, res, next) => {
    try {
      const { name } = req.params;
      const body = req.body;
      const categoryDetails = await service.findByName(name);
      const id = categoryDetails.id;
      const category = await service.update(id, body);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:name',
  passport.authenticate('jwt', {session: false}),
  checkRoles('admin'),
  validateDataHandler(getCategoryDto, 'params'),
  async (req, res, next) => {
    try {
      const { name } = req.params;
      const categoryDetails = await service.findByName(name);
      const id = categoryDetails.id;
      await service.delete(id);
      res.status(200).json({id});
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
