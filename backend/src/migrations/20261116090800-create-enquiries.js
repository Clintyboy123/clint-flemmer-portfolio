'use strict';

// Briefs sent through the contact form.
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('enquiries', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(120), allowNull: false },
      email: { type: Sequelize.STRING(254), allowNull: false },
      phone: { type: Sequelize.STRING(40), allowNull: false, defaultValue: '' },
      company: { type: Sequelize.STRING(160), allowNull: false, defaultValue: '' },
      services: { type: Sequelize.JSON, allowNull: false }, // the services ticked on the form
      budget: { type: Sequelize.STRING(120), allowNull: false, defaultValue: '' },
      deadline: { type: Sequelize.STRING(120), allowNull: false, defaultValue: '' },
      brief: { type: Sequelize.TEXT, allowNull: false },
      reference_links: { type: Sequelize.TEXT, allowNull: false },
      is_read: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('enquiries', ['created_at']); // the admin lists them newest first
    await queryInterface.addIndex('enquiries', ['is_read']); // and counts the unread ones
  },

  async down(queryInterface) {
    await queryInterface.dropTable('enquiries');
  },
};
