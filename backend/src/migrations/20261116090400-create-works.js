'use strict';

// The portfolio pieces. Each belongs to one work category.
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('works', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      category_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'work_categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT', // a category cannot be deleted while it still has works in it
      },
      title: { type: Sequelize.STRING(200), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },
      meta: { type: Sequelize.STRING(200), allowNull: false, defaultValue: '' },
      image: { type: Sequelize.STRING(500), allowNull: false },
      image_width: { type: Sequelize.INTEGER.UNSIGNED, allowNull: true },
      image_height: { type: Sequelize.INTEGER.UNSIGNED, allowNull: true },
      video: { type: Sequelize.STRING(500), allowNull: true },
      url: { type: Sequelize.STRING(500), allowNull: true },
      position: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
    // Works are always read "by category, in order".
    await queryInterface.addIndex('works', ['category_id', 'position']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('works');
  },
};
