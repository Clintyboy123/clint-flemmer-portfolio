'use strict';

// Starting copy for every page section (the texts are in data/content.js).
const content = require('./data/content');
const { isEmpty } = require('./data/helpers');

module.exports = {
  async up(queryInterface) {
    if (!(await isEmpty(queryInterface, 'page_contents'))) return;

    const now = new Date();
    await queryInterface.bulkInsert(
      'page_contents',
      Object.entries(content).map(([key, data]) => ({ key, data: JSON.stringify(data), created_at: now, updated_at: now }))
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('page_contents', { key: Object.keys(content) });
  },
};
