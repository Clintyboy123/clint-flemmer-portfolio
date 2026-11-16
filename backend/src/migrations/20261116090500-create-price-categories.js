'use strict';

// The sections of the price list (Graphic Design, Web & Social, ...).
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('price_categories', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      slug: { type: Sequelize.STRING(80), allowNull: false, unique: true },
      name: { type: Sequelize.STRING(120), allowNull: false },
      intro: { type: Sequelize.TEXT, allowNull: false },
      position: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('price_categories', ['position']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('price_categories');
  },
};
