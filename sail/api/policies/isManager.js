const jwt = require('jsonwebtoken');
const SECRET = "your_jwt_secret_key";

module.exports = async function (req, res, proceed) {
  var token;
  if (req.headers && req.headers.authorization) {
    var parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  if (!token) {
    return res.forbidden('No token provided');
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.forbidden('Invalid token');
    }
    req.user = decoded;
    
    // Check if user is a manager
    if (decoded.role !== 'manager') {
      return res.forbidden('Access denied. Manager role required.');
    }
    
    return proceed();
  });
};