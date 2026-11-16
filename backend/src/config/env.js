// Single place where environment variables are read. Nothing else touches process.env.
const path = require('path');

// Local runs read the project-root .env. In Docker, Compose injects the values and this does nothing.
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env'), quiet: true });

const nodeEnv = process.env.NODE_ENV || 'development';

const env = {
  nodeEnv,
  isProduction: nodeEnv === 'production',
  appName: process.env.APP_NAME || 'Website',
  port: Number(process.env.PORT || process.env.BACKEND_PORT || 3000),

  // How many proxies sit in front of the API. On the VPS that is 2
  // (VPS Nginx -> frontend Nginx -> here). Needed so rate limiting sees
  // each visitor's real IP instead of treating everyone as one person.
  trustProxy: Number(process.env.TRUST_PROXY || 2),

  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    name: process.env.DB_NAME || process.env.MYSQL_DATABASE,
    user: process.env.DB_USER || process.env.MYSQL_USER,
    password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD,
  },

  // Signs the admin login cookie. Anyone who knows it can sign in, so it only ever lives in .env.
  jwtSecret: process.env.JWT_SECRET,

  // The first admin account. Only read once, by the seeder that creates it.
  admin: {
    email: (process.env.ADMIN_EMAIL || '').trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD || '',
    name: (process.env.ADMIN_NAME || '').trim() || 'Admin',
  },

  // Where uploaded files are kept. In Docker this is the "uploads" volume (/app/uploads);
  // on a local run it is the uploads folder inside backend/.
  uploadDir: path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads')),
};

const missing = Object.entries({
  'DB_NAME / MYSQL_DATABASE': env.db.name,
  'DB_USER / MYSQL_USER': env.db.user,
  'DB_PASSWORD / MYSQL_PASSWORD': env.db.password,
  JWT_SECRET: env.jwtSecret,
})
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (missing.length) {
  throw new Error(`Missing environment variables: ${missing.join(', ')}. Copy .env.example to .env and fill it in.`);
}

// A short or copied-from-the-example secret would let a stranger forge the admin login.
if (env.isProduction && env.jwtSecret.length < 32) {
  throw new Error('JWT_SECRET is too short. Generate a real one with: openssl rand -base64 48');
}

module.exports = env;
