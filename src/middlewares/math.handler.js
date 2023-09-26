const boom = require('@hapi/boom');

const { checkListOfObjectSum } = require('../utils/math');

function checkSum(req, res, next) {
  const { products, orderTotal } = req.body;
  const sumOk = checkListOfObjectSum(products, orderTotal)
  if (sumOk) {
    next();
  } else {
    next(boom.badData('orderTotal is wrong'));
  }
}

module.exports = { checkSum }
