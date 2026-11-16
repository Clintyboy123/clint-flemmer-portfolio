// Admin sign-in: /api/auth/login, /logout, /me, /password.
const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { loginLimiter } = require('../middleware/rateLimit');
const { requireAuth } = require('../middleware/auth');
const controller = require('../controllers/auth.controller');

// bcrypt only reads the first 72 bytes of a password, so longer ones are refused rather than silently cut.
const fitsBcrypt = (value) => Buffer.byteLength(value) <= 72;

router.post(
  '/login',
  loginLimiter,
  validate([
    body('email').isString().withMessage('Enter your email address').bail().trim().toLowerCase()
      .isEmail().withMessage('Enter your email address').isLength({ max: 254 }),
    body('password').isString().withMessage('Enter your password').bail()
      .notEmpty().withMessage('Enter your password').isLength({ max: 200 }),
  ]),
  controller.login
);

router.post('/logout', controller.logout);

router.get('/me', requireAuth, controller.me);

router.put(
  '/password',
  requireAuth,
  validate([
    body('currentPassword').isString().withMessage('Enter your current password').bail()
      .notEmpty().withMessage('Enter your current password').isLength({ max: 200 }),
    body('newPassword').isString().withMessage('Enter a new password').bail()
      .isLength({ min: 10 }).withMessage('Use at least 10 characters')
      .custom(fitsBcrypt).withMessage('Use at most 72 characters'),
  ]),
  controller.changePassword
);

module.exports = router;
