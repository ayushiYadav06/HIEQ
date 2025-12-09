const jwt = require('jsonwebtoken');
const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');

exports.verifyToken = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Missing token' });
  const token = auth.split(' ')[1];
  try {
    const payload = verifyAccessToken(token);
    // attach user minimal info
    req.user = { id: payload.sub, role: payload.role, email: payload.email };
    // optional: fetch fresh user from DB
    req.currentUser = await User.findById(payload.sub).select('-passwordHash -refreshTokens').lean();
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

exports.requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (allowedRoles.includes(req.user.role)) return next();
    return res.status(403).json({ message: 'Forbidden - role' });
  };
};
