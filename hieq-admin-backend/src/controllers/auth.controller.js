// src/controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { createAccessToken, createRefreshToken, verifyRefreshToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;
const REFRESH_COOKIE_NAME = process.env.REFRESH_COOKIE_NAME || 'hieq_rt';
const REFRESH_COOKIE_MAXAGE = (() => {
  // milliseconds: if REFRESH_TOKEN_EXPIRES_IN is e.g. '30d' keep 30*24*60*60*1000
  const env = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';
  if (env.endsWith('d')) {
    const days = parseInt(env.slice(0, -1), 10) || 30;
    return days * 24 * 60 * 60 * 1000;
  }
  // fallback 30 days
  return 30 * 24 * 60 * 60 * 1000;
})();

const cookieOptions = (req) => {
  const isProd = (process.env.NODE_ENV === 'production');
  return {
    httpOnly: true,
    secure: isProd, // set true in production (HTTPS)
    sameSite: isProd ? 'none' : 'lax',
    maxAge: REFRESH_COOKIE_MAXAGE,
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: '/'
  };
};

exports.register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name) return res.status(400).json({ message: 'Missing fields' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({ email, passwordHash: hash, name, role });
    await user.save();

    return res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    // Case-insensitive email lookup (escape special regex characters)
    const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const user = await User.findOne({ email: { $regex: new RegExp(`^${escapedEmail}$`, 'i') } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Check if user is blocked
    if (user.blocked) return res.status(401).json({ message: 'Account is blocked' });

    // Check if user is deleted
    if (user.deleted) return res.status(401).json({ message: 'Account is deleted' });

    // Check if user has password (not social login only)
    if (!user.passwordHash) return res.status(401).json({ message: 'Use social login' });

    // Verify password
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    // Check JWT secrets are configured
    if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
      console.error('JWT secrets not configured');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const payload = { sub: user._id.toString(), role: user.role, email: user.email };
    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    // save refresh token (simple)
    user.refreshTokens = user.refreshTokens || [];
    user.refreshTokens.push({ token: refreshToken, createdAt: new Date() });
    await user.save();

    // set refresh token as httpOnly cookie
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, cookieOptions(req));

    // send access token in body
    res.json({
      accessToken,
      user: { id: user._id, email: user.email, name: user.name, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.refresh = async (req, res) => {
  try {
    // prefer cookie
    const cookieToken = req.cookies && req.cookies[REFRESH_COOKIE_NAME];
    const bodyToken = req.body && req.body.refreshToken;
    const refreshToken = cookieToken || bodyToken;

    if (!refreshToken) return res.status(400).json({ message: 'Missing refresh token' });

    // verify token
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: 'User not found' });

    // check token exists in DB
    const found = (user.refreshTokens || []).find(rt => rt.token === refreshToken);
    if (!found) return res.status(401).json({ message: 'Refresh token revoked' });

    // create new tokens
    const newPayload = { sub: user._id.toString(), role: user.role, email: user.email };
    const accessToken = createAccessToken(newPayload);
    const newRefreshToken = createRefreshToken(newPayload);

    // replace refresh token (rotate)
    user.refreshTokens = (user.refreshTokens || []).filter(rt => rt.token !== refreshToken);
    user.refreshTokens.push({ token: newRefreshToken, createdAt: new Date() });
    await user.save();

    // set rotated cookie
    res.cookie(REFRESH_COOKIE_NAME, newRefreshToken, cookieOptions(req));

    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = async (req, res) => {
  try {
    // Try cookie first, then body
    const cookieToken = req.cookies && req.cookies[REFRESH_COOKIE_NAME];
    const bodyToken = req.body && req.body.refreshToken;
    const refreshToken = cookieToken || bodyToken;

    if (!refreshToken) {
      // clear cookie anyway
      res.clearCookie(REFRESH_COOKIE_NAME, { path: '/' });
      return res.status(200).json({ message: 'Logged out' });
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (err) {
      // clear cookie anyway
      res.clearCookie(REFRESH_COOKIE_NAME, { path: '/' });
      return res.status(200).json({ message: 'Logged out' });
    }

    const user = await User.findById(payload.sub);
    if (user) {
      user.refreshTokens = (user.refreshTokens || []).filter(rt => rt.token !== refreshToken);
      await user.save();
    }

    // clear cookie
    res.clearCookie(REFRESH_COOKIE_NAME, { path: '/' });

    return res.json({ message: 'Logged out' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
