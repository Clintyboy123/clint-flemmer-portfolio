'use strict';

// Creates the first admin account from ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME in .env.
// The password is hashed before it is stored; the plain password never reaches the database.
const bcrypt = require('bcrypt');
const { QueryTypes } = require('sequelize');
const env = require('../config/env');

const FILE = '20261116100000-admin-user.js';

module.exports = {
  async up(queryInterface) {
    const { email, password, name } = env.admin;

    if (!email || !password) {
      console.log(
        '[seed] ADMIN_EMAIL / ADMIN_PASSWORD are not set, so no admin account was created. ' +
          `Add them to .env, restart the backend, then run: docker compose exec backend ./node_modules/.bin/sequelize-cli db:seed --seed ${FILE}`
      );
      return;
    }

    const existing = await queryInterface.sequelize.query('SELECT id FROM users WHERE email = :email LIMIT 1', {
      replacements: { email },
      type: QueryTypes.SELECT,
    });
    if (existing.length) {
      console.log('[seed] the admin account already exists, left as it is');
      return;
    }

    const now = new Date();
    await queryInterface.bulkInsert('users', [
      { name, email, password_hash: await bcrypt.hash(password, 12), created_at: now, updated_at: now },
    ]);
    console.log(`[seed] admin account created for ${email}`);
  },

  async down(queryInterface) {
    if (env.admin.email) await queryInterface.bulkDelete('users', { email: env.admin.email });
  },
};
