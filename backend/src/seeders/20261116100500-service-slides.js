'use strict';

// Starting Services carousel (the slides are in data/serviceSlides.js).
const slides = require('./data/serviceSlides');
const { isEmpty } = require('./data/helpers');

const MEDIA = '/media/work';

module.exports = {
  async up(queryInterface) {
    if (!(await isEmpty(queryInterface, 'service_slides'))) return;

    const now = new Date();
    await queryInterface.bulkInsert(
      'service_slides',
      slides.map((slide, index) => ({
        title: slide.title,
        text: slide.text,
        tags: slide.tags,
        image: `${MEDIA}/${slide.file}`,
        video: slide.video ? `${MEDIA}/${slide.file.replace(/\.[a-z0-9]+$/i, '.mp4')}` : null,
        link: slide.link,
        link_label: slide.linkLabel,
        position: index + 1,
        created_at: now,
        updated_at: now,
      }))
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('service_slides', null, {});
  },
};
