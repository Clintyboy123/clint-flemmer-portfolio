'use strict';

// The editable copy of each page section. One row per section ("home.hero", "footer", ...),
// with that section's texts stored together as JSON because every section has a different shape.
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('page_contents', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      key: { type: Sequelize.STRING(60), allowNull: false, unique: true },
      data: { type: Sequelize.JSON, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('page_contents');
  },
};
