'use strict';

// The sections of the Works page (Graphic Design, Motion Graphics, ...).
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('work_categories', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      slug: { type: Sequelize.STRING(80), allowNull: false, unique: true },
      name: { type: Sequelize.STRING(120), allowNull: false },
      intro: { type: Sequelize.TEXT, allowNull: false },
      tags: { type: Sequelize.JSON, allowNull: false }, // a short list of words, e.g. ["Campaigns", "Print"]
      layout: { type: Sequelize.ENUM('gallery', 'sites'), allowNull: false, defaultValue: 'gallery' },
      position: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('work_categories', ['position']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('work_categories');
  },
};
