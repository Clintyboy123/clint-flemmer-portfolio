// The Express app: security, logging, body parsing, routes, error handling. No listening here (see server.js).
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const env = require('./config/env');
const routes = require('./routes');
const { apiLimiter } = require('./middleware/rateLimit');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const { dirs } = require('./utils/storage');

const app = express();

app.set('trust proxy', env.trustProxy);
app.disable('x-powered-by');

app.use(helmet());
app.use(
  morgan(env.isProduction ? 'combined' : 'dev', {
    skip: (req) => req.originalUrl === '/api/health', // Docker checks this every 30s; keep the logs readable
  })
);
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser()); // reads the admin sign-in cookie

// Images, videos and music uploaded in the admin. Public, and cached for a year: every upload gets a
// new random name, so a file at a given address never changes. Supports range requests (video seeking).
// Mounted before the rate limit so a page full of images never counts against a visitor.
// Enquiry attachments live in a different folder and are never served here.
app.use(
  '/api/uploads/media',
  express.static(dirs.media, { index: false, dotfiles: 'deny', maxAge: '365d', immutable: true, fallthrough: true })
);

const isHealthCheck = (req) => req.path === '/health';
app.use('/api', (req, res, next) => (isHealthCheck(req) ? next() : apiLimiter(req, res, next)), routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
