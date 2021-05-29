const {verify} = require('jsonwebtoken');

const validate = (req, res , next) => {

  const token1 = req.header("Authorization") || "";

  next();
}


module.exports = validate;