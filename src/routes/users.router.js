const express = require('express');
const passport = require('passport');

const UserService = require('./../services/user.service');
const validateDataHandler = require('./../middlewares/validator.handler');
const { checkRoles, checkUserLogged } = require('../middlewares/auth.handler');
const { updateUserDto, createUserDto, getUserDto } = require('../dtos/user.dto');

const router = express.Router();
const service = new UserService();

router.get('/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  async (req, res, next) => {
    try {
      const users = await service.find();
      res.json(users);
    } catch (error) {
      next(error);
    }
  },
);

router.get('/:id',
  passport.authenticate('jwt', { session: false }),
  validateDataHandler(getUserDto, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await service.findOne(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },
);

router.post('/',
  validateDataHandler(createUserDto, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newUser = await service.create(body);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  },
);

router.patch('/:id',
  passport.authenticate('jwt', { session: false }),
  checkUserLogged,
  validateDataHandler(getUserDto, 'params'),
  validateDataHandler(updateUserDto, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const user = await service.update(id, body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },
);

router.delete('/:id',
  passport.authenticate('jwt', { session: false }),
  checkUserLogged,
  validateDataHandler(getUserDto, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(200).json({ id });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
