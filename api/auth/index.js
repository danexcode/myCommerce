const passport = require('passport');

const LocalStrategy = require('./strategies/local.strategy');
const JwtStrategy = require('./strategies/jwt.strategy');

function setupAuthStrategies(){
  passport.use(LocalStrategy);
  passport.use(JwtStrategy);
}

module.exports = setupAuthStrategies;
