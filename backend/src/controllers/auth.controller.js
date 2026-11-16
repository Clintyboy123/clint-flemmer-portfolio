const { matchedData } = require('express-validator');
const auth = require('../services/auth.service');
const format = require('../services/format');
const { startSession, endSession } = require('../middleware/auth');

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = matchedData(req);
  const user = await auth.login(email, password);
  startSession(res, user);
  res.json({ success: true, data: { user: format.user(user) } });
};

// POST /api/auth/logout
exports.logout = async (req, res) => {
  endSession(res);
  res.json({ success: true, message: 'Signed out.' });
};

// GET /api/auth/me
exports.me = async (req, res) => {
  res.json({ success: true, data: { user: format.user(req.user) } });
};

// PUT /api/auth/password - also signs out every other device, and keeps this one signed in.
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = matchedData(req);
  const user = await auth.changePassword(req.user.id, currentPassword, newPassword);
  startSession(res, user);
  res.json({ success: true, message: 'Password changed.' });
};
