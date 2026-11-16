// Admin sign-in. After logging in, the browser holds a signed token in an httpOnly cookie
// (page JavaScript cannot read it). requireAuth checks that cookie on every admin request.
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const { User } = require('../models');

const COOKIE = 'session';
const DAYS = 7;

const cookieOptions = {
  httpOnly: true,
  secure: env.isProduction, // only sent over https on the live site
  sameSite: 'lax', // not sent with forms posted from other websites
  path: '/',
};

const startSession = (res, user) => {
  const token = jwt.sign({ sub: String(user.id) }, env.jwtSecret, { expiresIn: `${DAYS}d` });
  res.cookie(COOKIE, token, { ...cookieOptions, maxAge: DAYS * 24 * 60 * 60 * 1000 });
};

const endSession = (res) => res.clearCookie(COOKIE, cookieOptions);

// Loads the signed-in user into req.user, or answers 401.
const requireAuth = async (req, res, next) => {
  const token = req.cookies?.[COOKIE];
  if (!token) throw new ApiError(401, 'Please sign in.');

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new ApiError(401, 'Your session has expired. Please sign in again.');
  }

  const user = await User.findByPk(payload.sub);
  if (!user) throw new ApiError(401, 'Please sign in.');

  // A password change signs out every login made before it.
  if (user.passwordChangedAt && payload.iat < Math.floor(user.passwordChangedAt.getTime() / 1000)) {
    throw new ApiError(401, 'Your session has expired. Please sign in again.');
  }

  req.user = user;
  next();
};

module.exports = { requireAuth, startSession, endSession };
