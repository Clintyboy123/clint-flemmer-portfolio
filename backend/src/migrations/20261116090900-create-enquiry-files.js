'use strict';

// Attachments sent with an enquiry. The files themselves are on disk (uploads/enquiries);
// this table remembers what each one is and which enquiry it belongs to.
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('enquiry_files', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      enquiry_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'enquiries', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // deleting an enquiry removes the records of its attachments too
      },
      original_name: { type: Sequelize.STRING(255), allowNull: false }, // the name the visitor's file had
      stored_name: { type: Sequelize.STRING(100), allowNull: false, unique: true }, // the name it has on disk
      mime: { type: Sequelize.STRING(100), allowNull: false },
      size: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false }, // bytes
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('enquiry_files', ['enquiry_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('enquiry_files');
  },
};
