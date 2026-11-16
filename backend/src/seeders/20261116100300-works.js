'use strict';

// Starting Works page: the categories and their pieces (listed in data/works.js).
const categories = require('./data/works');
const { isEmpty, idsBySlug } = require('./data/helpers');

const MEDIA = '/media/work';

module.exports = {
  async up(queryInterface) {
    if (!(await isEmpty(queryInterface, 'work_categories'))) return;

    const now = new Date();
    await queryInterface.bulkInsert(
      'work_categories',
      categories.map((category, index) => ({
        slug: category.slug,
        name: category.name,
        intro: category.intro,
        tags: JSON.stringify(category.tags),
        layout: category.layout,
        position: index + 1,
        created_at: now,
        updated_at: now,
      }))
    );

    const ids = await idsBySlug(queryInterface, 'work_categories');
    await queryInterface.bulkInsert(
      'works',
      categories.flatMap((category) =>
        category.works.map((work, index) => ({
          category_id: ids[category.slug],
          title: work.title,
          description: work.description,
          meta: work.meta,
          image: `${MEDIA}/${work.file}.jpg`,
          image_width: work.width,
          image_height: work.height,
          video: work.video ? `${MEDIA}/${work.file}.mp4` : null,
          url: work.url || null,
          position: index + 1,
          created_at: now,
          updated_at: now,
        }))
      )
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('works', null, {});
    await queryInterface.bulkDelete('work_categories', null, {});
  },
};
