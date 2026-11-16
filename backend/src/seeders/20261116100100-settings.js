'use strict';

// Starting site settings. Every value is stored as text ("true" / "false" for switches).
const defaults = require('./data/settings');
const { isEmpty } = require('./data/helpers');

module.exports = {
  async up(queryInterface) {
    if (!(await isEmpty(queryInterface, 'settings'))) return;

    const now = new Date();
    await queryInterface.bulkInsert(
      'settings',
      Object.entries(defaults).map(([key, value]) => ({ key, value: String(value), created_at: now, updated_at: now }))
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('settings', { key: Object.keys(defaults) });
  },
};
