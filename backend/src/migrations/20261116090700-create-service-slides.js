'use strict';

// The slides of the Services carousel on the home page.
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('service_slides', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      title: { type: Sequelize.STRING(120), allowNull: false },
      text: { type: Sequelize.TEXT, allowNull: false },
      tags: { type: Sequelize.STRING(300), allowNull: false, defaultValue: '' },
      image: { type: Sequelize.STRING(500), allowNull: false },
      video: { type: Sequelize.STRING(500), allowNull: true },
      link: { type: Sequelize.STRING(300), allowNull: false, defaultValue: '' },
      link_label: { type: Sequelize.STRING(80), allowNull: false, defaultValue: '' },
      position: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('service_slides', ['position']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('service_slides');
  },
};
