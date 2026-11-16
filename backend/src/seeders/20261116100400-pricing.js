'use strict';

// Starting price list: the categories and their rows (listed in data/pricing.js).
const categories = require('./data/pricing');
const { isEmpty, idsBySlug } = require('./data/helpers');

module.exports = {
  async up(queryInterface) {
    if (!(await isEmpty(queryInterface, 'price_categories'))) return;

    const now = new Date();
    await queryInterface.bulkInsert(
      'price_categories',
      categories.map((category, index) => ({
        slug: category.slug,
        name: category.name,
        intro: category.intro,
        position: index + 1,
        created_at: now,
        updated_at: now,
      }))
    );

    const ids = await idsBySlug(queryInterface, 'price_categories');
    await queryInterface.bulkInsert(
      'price_items',
      categories.flatMap((category) =>
        category.items.map((item, index) => ({
          category_id: ids[category.slug],
          title: item.title,
          detail: item.detail,
          amount: item.amount,
          is_from: Boolean(item.from),
          position: index + 1,
          created_at: now,
          updated_at: now,
        }))
      )
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('price_items', null, {});
    await queryInterface.bulkDelete('price_categories', null, {});
  },
};
