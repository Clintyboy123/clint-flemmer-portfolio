// An attachment sent with an enquiry. The file itself is on disk in uploads/enquiries.
module.exports = (sequelize, DataTypes) => {
  const EnquiryFile = sequelize.define(
    'EnquiryFile',
    {
      enquiryId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      originalName: { type: DataTypes.STRING(255), allowNull: false },
      storedName: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      mime: { type: DataTypes.STRING(100), allowNull: false },
      size: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    },
    { tableName: 'enquiry_files' }
  );

  EnquiryFile.associate = (models) => {
    EnquiryFile.belongsTo(models.Enquiry, { as: 'enquiry', foreignKey: 'enquiryId', onDelete: 'CASCADE' });
  };

  return EnquiryFile;
};
