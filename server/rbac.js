const jwt = require('jsonwebtoken');
const config = require('./config');

function verifyRole(roles) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
      const user = jwt.verify(token, config.jwtSecret);
      req.user = user;
      const hasRole = roles.some(role => user.roles.includes(role));
      if (!hasRole) return res.status(403).json({ error: 'Forbidden' });
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
}

module.exports = { verifyRole };
