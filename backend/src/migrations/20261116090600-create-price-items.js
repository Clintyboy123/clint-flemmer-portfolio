'use strict';

// The rows of the price list. Each belongs to one price category.
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('price_items', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      category_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'price_categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT', // a category cannot be deleted while it still has prices in it
      },
      title: { type: Sequelize.STRING(200), allowNull: false },
      detail: { type: Sequelize.STRING(200), allowNull: false, defaultValue: '' },
      amount: { type: Sequelize.INTEGER.UNSIGNED, allowNull: true }, // whole rand; empty = "Get a quote"
      is_from: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }, // show "From" before the price
      position: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('price_items', ['category_id', 'position']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('price_items');
  },
};
